var User = require('../models/user');
var Team = require('../models/team');
var jwt = require('jsonwebtoken');
var secret = 'bacon';

module.exports = function(router) {
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
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
        console.log(req.body.username);
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
            team.save(function (err) {
                if (err) {
                    res.json({success: false, message:'Team with this name already exists'});
                } else {
                    res.json({success: true, message:'Team created'});
                }
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
    return router;
};