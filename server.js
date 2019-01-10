var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.json());
const Role = require("./model/Role");

const userAuthRoute = require('./router/router')

// Configuring the database
const config = require("./config/config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(
    config.MONGO_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.log("Could not connect to MongoDB.");
    process.exit();
  });


app.use('/api/auth' , userAuthRoute);

  // Create a server
  var server = app.listen(8080 , function () {
      var host = server.address().address
      var port = server.address().port
      console.log("App listening at http://%s:%s", host, port)
  })
  
  function initial() {
      Role.count((err , count) => {
        if (!err && count === 0) {
            // USER ROLE
            new Role({name : 'USER'}).save(err => {
                if(err) return console.error(err.stack)
				console.log("USER_ROLE is added")
            });
            // ADMIN ROLE
            new Role({name : 'ADMIN'}).save(err => {
                if(err) return console.error(err.stack)
				console.log("ADMIN_ROLE is added")
            });
            // PM ROLE
            new Role({name : 'PM'}).save(err => {
                if(err) return console.error(err.stack)
				console.log("PM_ROLE is added")
            });
        }
      });
  }
