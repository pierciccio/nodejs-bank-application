var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'pierciccio93';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        fiscalcode: user.fiscalcode,
        email: user.email,
        role: user.role,
        iat: moment().unix,
        exp: moment().add(30, 'days').unix
    };
    
    return jwt.encode(payload, secret);
};