var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {type: String, lowercase: true, required: true, unique: true},
    type: {type: String, required: true},
    ageGroup: {type: String, lowercase: true, required: true},
    manager: {type: String, ref: 'User'},
    member: [{type: String, ref: 'TeamMember'}]
});

module.exports = mongoose.model('Team', TeamSchema);