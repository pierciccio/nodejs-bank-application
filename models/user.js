var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = ({
    firstname: String,
    lastname: String,
    fiscalcode: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true}, 
    password: String,
    role: String,
    iban: {type: String, unique: true, required: true},
    money: {type: Number, default: 0}
});

module.exports = mongoose.model('User', UserSchema);