var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamMemberSchema = new Schema({
    fname: {type: String, lowercase: true, required: true},
    sname: {type: String, lowercase: true, required: true},
    email: {type: String, lowercase: true, required: true, unique: true},
    team: {type: String, ref: 'Team'},
    performanceData : {}
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);