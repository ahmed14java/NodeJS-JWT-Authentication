const config = require("../config/config");
const Role = require("../model/Role");
const User = require("../model/User");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const loginController = {};

loginController.signin = (req, res) => {
  console.log("Sign in");
  const { username, password } = req.body;

  User.findOne({username}).exec((err, user) => {
    if (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with Username = " + username
        });
      }
      return res.status(500).send({
        message: "Error retrieving User with Username = " + username
      });
    }
    console.log(user.password , password);
    
    var passwordIsInvalid = bcrypt.compare(password, user.password);
    
    if (!passwordIsInvalid) {
      return res
        .status(401)
        .send({ auth: false, accessToken: null, reason: "Invalid password!" });
    }
    var token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: 86400 });
    return res.status(200).send({ auth: true, accessToken: token });
  });
};

module.exports = loginController;
