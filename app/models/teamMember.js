var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamMemberSchema = new Schema({
    fname: {type: String, required: true},
    sname: {type: String, required: true},
    email: {type: String, lowercase: true, required: true, unique: true},
    team: {type: String, ref: 'Team'},
    performanceData : [{type: {type: String}, units: {type: String}, value: [{data: {type: number}, date:{type: Date}}]}]
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);