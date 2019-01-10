const config = require('../config/config');
const Role  = require('../model/Role');
const User = require('../model/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');