const config = require('../config/config');
const ROLES = config.ROLES;
const User = require('../model/User');

const signUpVerify = {};

signUpVerify.checkDuplicateUserNameOrEmail = (req , res , next) => {
    //Check Username is already exist!
    const { username , email} = req.body;
    User.findOne({username}).exec((err , user) => {
        if (err && err.kind !== 'ObjectId') {
            return res.status(500).send({
                message: 'Error retrieving User with Username =' + username
            });
        }
        if (user) {
            return res.status(400).send({
                message: 'Fail -> Username is already taken!'
            });
        }

        User.findOne({email}).exec((err , user) => {
            if (err && err.kind !== 'ObjectId') {
                return res.status(500).send({
                    message: 'Error retrieving User with Email =' + email
                });
            }
            if (user) {
                return res.status(400).send({
                    message: 'Fail -> Email is already taken!'
                });
            }
            next();
        });

    });
}

signUpVerify.checkRolesExisted = (req , res , next) => {
    const { roles } = req.body;
    for (let i = 0; i < roles.length; i++) {
        if (!ROLES.includes(roles[i].toUpperCase())) {
            return res.status(400).send('Fail -> Does NOT exist Role =' + roles[i]);
        }
    }
    next();
}

module.exports = signUpVerify;