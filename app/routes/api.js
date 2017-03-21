var User = require('../models/user');
var Team = require('../models/team');
var TeamMember = require('../models/teamMember');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var secret = 'bacon';

module.exports = function(router) {
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = user.setPassword(req.body.password);
        user.email = req.body.email;
        if (req.body.username == null || req.body.password == null || req.body.email == null ||
            req.body.username === '' || req.body.password === '' || req.body.email === '') {
            res.json({success: false, message:'Ensure username, email, and password were provided'});
        } else {
            user.save(function (err) {
                if (err) {
                    res.json({success: false, message:'Username or email already exists'});
                } else {
                    res.json({success: true, message:'User created'});
                }
            });
        }
    });

    router.post('/authenticate', function (req,res){
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) throw err;
            if(!user) {
                res.json({ success:false, message: 'Could not authenticate user'});
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ success: false, message: 'No password provided'});
                }
                if(!validPassword) {
                    res.json({ success: false, message: 'Could not authenticate password'});
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email}, secret, {expiresIn: '12h'});
                    res.json({ success: true, message: 'User authenticated', token: token});
                }
            }
        });
    });

    router.post('/createTeam', function (req, res) {
        var team = new Team();
        team.name = req.body.name;
        team.type = req.body.type;
        team.ageGroup = req.body.ageGroup;
        if (req.body.name == null || req.body.type == null || req.body.ageGroup == null ||
            req.body.name === '' || req.body.type === '' || req.body.ageGroup === '') {
            res.json({success: false, message:'Ensure all fields have been filled'});
        } else {
            User.findOne({username: req.body.username}, '_id team', function (err, user) {
                if (err) {
                    res.json({success: false, message: 'Could not find manager'});
                }
                team.manager = user._id;
                team.save(function (err) {
                    if (err) {
                        res.json({success: false, message:'Team with this name already exists'});
                    }
                    Team.findOne({name: team.name}, '_id', function (err, team) {
                        if (err) {
                            res.json({success: false, message: 'Could not find manager'});
                        }
                        user.team.push(team._id);
                        user.save(function (err) {
                            if (err) {
                                res.json({success: false, message: 'Team with this name already exists'});
                            } else {
                                res.json({success: true, message: 'Team added to user'});
                            }
                        });
                    });
                });
            });
        }
    });

    router.post('/addMember', function (req, res) {
        var member = new TeamMember();
        member.fname = req.body.fname;
        member.sname = req.body.sname;
        member.email = req.body.email;
        if (req.body.fname == null || req.body.sname == null || req.body.email == null ||
            req.body.fname === '' || req.body.sname === '' || req.body.email === '') {
            res.json({success: false, message:'Ensure all fields have been filled'});
        } else {
            Team.findOne({name: req.body.teamname}, '_id member', function (err, team) {
                if (err) {
                    res.json({success: false, message: 'Could not find team'});
                }
                member.team = team._id;
                member.save(function (err) {
                    TeamMember.findOne({email: member.email}, '_id', function (err, member) {
                        if (err) {
                            res.json({success: false, message: 'Could not find team member'});
                        }
                        team.member.push(member._id);
                        team.save(function (err) {
                            if (err) {
                                res.json({success: false, message: 'Member with this email already exists'});
                            } else {
                                res.json({success: true, message: 'Member added to team'});
                            }
                        });
                    });
                });
            });
        }
    });

    router.use(function(req, res, next) {
        var token = req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({success: false, message: 'Token invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({success: false, message: 'No token found' });
        }
    });

    router.post('/profile', function (req,res) {
        res.send(req.decoded);
    });

    router.post('/getTeams', function (req,res) {
        User.findOne({username: req.decoded.username}, '_id', function (err, user) {
            if (err) {
                res.json({success: false, message: 'Could not find user'});
            }
            Team.find({manager: user._id}, 'name type ageGroup member', function (err, team) {
                if (err) {
                    res.json({success: false, message: 'Could not find manager'});
                }
                req.team = team;
                res.send(req.team);
            });
        });
    });

    router.post('/getTeam', function (req,res) {
        Team.findOne({name: req.body.name}, 'name type ageGroup member', function (err, team) {
            if (err) {
                res.json({success: false, message: 'Could not find manager'});
            }
            req.team = team;
            res.send(req.team);
        });
    });

    router.post('/getMembers', function (req,res) {
        TeamMember.find({team: req.body.id}, '_id fname sname email performanceData', function (err, members) {
            if (err) {
                res.json({success: false, message: 'Could not find manager'});
            }
            req.members = members;
            res.send(req.members);
        });
    });

    router.post('/getMember', function (req,res) {
        TeamMember.findOne({_id: req.body.id}, 'fname sname email performanceData', function (err, member) {
            if (err) {
                res.json({success: false, message: 'Could not find manager'});
            }
            req.member = member;
            res.send(req.member);
        });
    });

    router.post('/addPerformanceData', function (req,res) {
        console.log(req.body.performanceData);
        if (req.body.performanceData.type == null || req.body.performanceData.units == null ||
            req.body.performanceData.type === '' || req.body.performanceData.units === '') {
            res.json({success: false, message:'Ensure all fields have been filled'});
        } else {
            TeamMember.find({team: req.body.performanceData.team}, 'performanceData', function (err, members) {
                console.log(members);
                if (err) {
                    res.json({success: false, message: 'Could not find team member'});
                }
                var perfData = _.omit(req.body.performanceData, 'team');
                console.log(perfData);
                members.forEach(function (member) {
                    console.log(member);
                    member.performanceData.push({type: perfData.type, units: perfData.units});
                    member.save(function (err) {
                        if (err) {
                            res.json({success: false, message: 'Could not add performance data to member'});
                        }
                    });
                });
                res.json({success: true, message: 'Performance data added'});
            });
        }
    });

    router.post('/addPerformanceValues', function (req,res) {
        console.log(req.body.performanceValues);
        if (req.body.performanceValues.value == null || req.body.performanceValues.date == null ||
            req.body.performanceValues.value === '' || req.body.performanceValues.date === '') {
            res.json({success: false, message:'Ensure all fields have been filled'});
        } else {
            TeamMember.findOne({_id: req.body.performanceValues.member_id}, 'performanceData', function (err, member) {
                console.log(member);
                if (err) {
                    res.json({success: false, message: 'Could not find team member'});
                }
                member.performanceData.forEach(function (perfData) {
                    if (perfData.type == req.body.performanceValues.type) {
                        perfData.value.push({ data: req.body.performanceValues.value, date: req.body.performanceValues.date });
                        member.save(function (err) {
                            if (err) {
                                res.json({success: false, message: 'Could not add performance data to member'});
                            } else {
                                res.json({success: true, message: 'Values added'});
                            }
                        });
                    }
                });
            });
        }
    });

    return router;
};