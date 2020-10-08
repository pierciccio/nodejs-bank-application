var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUser(req, res) {
    var params = req.body;
    var user = new User();

    if (params.firstname && params.lastname && params.fiscalcode &&
        params.email && params.password) {
            
            user.firstname = params.firstname;
            user.lastname = params.lastname;
            user.fiscalcode = params.fiscalcode;
            user.email = params.email;
            user.iban = params.iban;
            user.role = 'ROLE_USER'

            User.find({
                $or: [
                    { email: user.email.toLowerCase() },
                    { fiscalcode: user.fiscalcode.toLowerCase() }
                ]
            })
            .exec((err, users) => {
                if (err)
                return res.status(500).send({ message: 'User request failed'});
                if (users && users.length >= 1) {
                    res.status(200).send({ message: 'The email or fiscal code entered already exists'});
                } else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if (err) 
                            return res.status(500).send({ message: 'Error saving user'});
                            
                            if (userStored) {
                                res.status(200).send({ user: userStored });
                            } else {
                                res.status(400).send({ message: 'The user has not registered'});
                            }
                        });
                    });
                }
            });
        } 
    else {
        res.status(200).send({message: 'Enter all the fields' });
    }
}


function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err)
        return res.status(500).send({ message: 'Request failed'});

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    user.password = undefined;
                    res.status(200).send({ user: user, token: jwt.createToken(user) });
                } else {
                    return res.status(404).send({ message: 'Password error' });
                }
            });
        }
        else {
            return res.status(404).send({ message: 'The user could not be found' });
        }
    });
}


function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) 
        return res.status(500).send({ message: 'Request failed' });
        
        if (!user) 
        return res.status(404).send({ message: 'User not found' });

        user.password = undefined;

        return res.status(200).send({user: user});
    });
}


function updateUser(req, res) {
    var userId = req.params.id;
    var params = req.body;

    delete params.password;

    if (userId != req.user.sub) {
        return res.status(500)
        .send({ message: 'You dont have permission to update user data' });
    }
    User.find({
        $or: [
            { email: params.email },
            { fiscalcode: params.fiscalcode }
        ]
    }).exec((err, users) => {
        var similar_dates = false;
        users.forEach((user) => {
            if (user && user._id != userId)
                similar_dates = true;
        });
        
        if (similar_dates)
            return res.status(404).send({ message: 'Data is already in use' });

        User.findByIdAndUpdate(userId, params, {new: true, useFindAndModify: false }, (err, userUpdate) => {
            if (err)
                return res.status(500).send({ message: 'Request failed' });
            if (!userUpdate)
                return res.status(404).send({ message: 'Failed to update user'});
        
            return res.status(200).send({ user: userUpdate });    
        });    
    });
}

function depositMoney(req, res) {
    
    var userId = req.params.id;
    var amount = req.body.money;

    if (userId != req.user.sub) {
        return res.status(500)
        .send({ message: 'You dont have permission to deposit money' });
    }
    
    User.findById(userId, function(err, userUpdate) {
        if (err)
            return res.status(500).send({ message: 'Request failed' });
        if (!userUpdate)
            return res.status(404).send({ message: 'Failed to update user'});
        else {
            var newAmount = parseInt(userUpdate.money) + parseInt(amount);
            userUpdate.money = newAmount;
            userUpdate.save();
            return res.status(200).send({ user: userUpdate });    
        }
        
    });    
}

function withdrawMoney(req, res) {
    
    var userId = req.params.id;
    var amount = req.body.money;

    if (userId != req.user.sub) {
        return res.status(500)
        .send({ message: 'You dont have permission to deposit money' });
    }
    
    User.findById(userId, function(err, userUpdate) {
        if (err)
            return res.status(500).send({ message: 'Request failed' });
        if (!userUpdate)
            return res.status(404).send({ message: 'Failed to update user'});
        else {
            var newAmount = parseInt(userUpdate.money) - parseInt(amount);
            userUpdate.money = newAmount;
            userUpdate.save();
            return res.status(200).send({ user: userUpdate });    
        }
        
    });    
}

function transactMoney(req, res) {

    var userId = req.params.id;
    var amount = req.body.money;
    var newAmount, decreseAmount;

    User.findById(userId, function(err, foundUser) {
        if (err)
        return res.status(500).send({message: 'error returning user'});
        if (!foundUser)
        return res.status(404).send({message: 'user not found'});
        else {
            User.find({iban: req.body.iban}, function(err, users) {
                if (err)
                return res.status(500).send({message: 'error returning users'}); 
                if (!users)
                return res.status(404).send({message: 'users not founds'});                
                else {
                    newAmount = parseInt(users[0].money) + parseInt(amount);
                    users[0].money = newAmount;
                    decreseAmount = parseInt(foundUser.money) - parseInt(amount);
                    foundUser.money = decreseAmount;
                    foundUser.save();
                    users[0].save();
                    res.status(200).send({ user: foundUser, users: users }); 
                }
            });
        }
    });
}

module.exports = {
    saveUser,
    loginUser,
    getUser,
    updateUser,
    depositMoney,
    withdrawMoney,
    transactMoney
};