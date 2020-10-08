var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'pierciccio93';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'The request does not have the authentication header' });
   }

   var token = req.headers.authorization.replace(/['"]+/g, '');

   try {
       var payload = jwt.decode(token, secret);
       if (payload.exp <= moment().unix()) {
           return res.status(401).send({ message: 'The token has expired' });
       } 
   }
   catch (ex) {
       return res.status(401).send({ message: 'The token is invalid' });
   }
   req.user = payload;
   next();
};