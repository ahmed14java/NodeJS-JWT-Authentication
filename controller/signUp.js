const config = require("../config/config");
const Role = require("../model/Role");
const User = require("../model/User");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signupController = {};

signupController.signup = (req, res) => {
  //Save user to database
  const { name, username, email, password, roles } = req.body;
  const newUser = new User({ name, username, email, password });

  //Save a user to mongoDB
  newUser
    .save()
    .then(savedUser => {
      Role.find(
        { name: { $in: roles.map(role => role.toUpperCase()) } },
        (err, roles) => {
          if (err) {
            return res.status(500).send("Error -> " + err);
          }
          // Update User with Roles
          savedUser.roles = roles.map(role => role._id);
          savedUser.save(function(err) {
            if (err) {
              return res.status(500).send("Error -> " + err);
            }
            return res.send("User registred successfully");
          });
        }
      );
    })
    .catch(err => {
      return res.status(500).send("Fail! Error -> " + err);
    });
};

module.exports = signupController;
