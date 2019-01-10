const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../model/User');
const Role = require('../model/Role');

const authJwt = {};

authJwt.verifyToken = (req , res , next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            auth: false , 
            message: 'No token provided.'
        });
    }
    jwt.verify(token , config.SECRET , (err , decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Fail to Authentication. Error ->' + err
            });
        }
        req.userId = decoded.id;
        next();
    });
}

authJwt.isAdmin = (req , res , next) => {
    const { _id } = req.userId;
    const { username } = req.body;
    User.findOne(_id).exec((err , user) => {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
					message: "User not found with Username = " + username
				});  
            }
            return res.status(500).send({
				message: "Error retrieving User with Username = " + username
			});
        }

        Role.find({'_id': { $in: user.roles } } , (err , roles) => {
            if (err) {
                return res.status(500).send('Error -> ' + err);
            }
            for (let i = 0; i< roles.length; i++) {
              if (roles[i].toUpperCase() === 'ADMIN') {
                  return next();
              }
               
            }
            return res.status(403).send("Require Admin Role!");
        })

    });
}

authJwt.isPmOrAdmin = (req , res , next) => {
    const { _id } = req.userId;
    const { username } = req.body;
    User.findOne(_id).exec((err , user) => {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
					message: "User not found with Username = " + username
				});  
            }
            return res.status(500).send({
				message: "Error retrieving User with Username = " + username
			});
        }

        Role.find({'_id': { $in: user.roles } } , (err , roles) => {
            if (err) {
                return res.status(500).send('Error -> ' + err);
            }
            for (let i = 0; i< roles.length; i++) {
                let role = roles[i].toUpperCase();
              if (role === 'PM' || role === 'ADMIN') {
                  return next();
              }
               
            }
            return res.status(403).send("Require PM orAdmin Roles!");
        })

    });
}

module.exports = authJwt;