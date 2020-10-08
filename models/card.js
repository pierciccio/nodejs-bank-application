var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = ({
    name : String,
    cardNumber: {type: String, unique: true, required: true},
    expMonth: Number,
    expYear: Number,
    cvc: Number,
    money: {type: Number, default: 0},
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Card', CardSchema);