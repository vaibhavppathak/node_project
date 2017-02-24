var express = require('express');
var app = express()
var mongoose = require('mongoose');
var router = express.Router(); //creatig insatnce of express function
var crypto = require('crypto');
var moment = require("moment");
<!---- user Registration ------>

router.post('/user/register', function(req, res, next) {
    var username = req.body.user_name;
    var password = req.body.password;
    var cpassword = req.body.confirm_password;
    var email = req.body.email;
    var firstname = req.body.first_name;
    var lastname = req.body.last_name;
    var pass = crypto.createHash('md5').update(password).digest('hex');
    if ((username.length > 0) && (password.length > 0) && (cpassword.length > 0) && (email.length > 0) && (firstname.length > 0) && (lastname.length > 0)) {
        if (password == cpassword) {
            var record = new req.users({
                "username": username,
                "password": pass,
                "email": email,
                "firstname": firstname,
                "lastname": lastname,
            });
            record.save(function(err, details) {
                if (err) {
                    next("user already exist");
                } else {
                    next("Record inserted successfully");
                }
            });
        } else {
            next("Password is not matched")
        }
    } else {
        next("All field must be filled out");
    }
});

<!--------- login -------->

router.post('/user/login', function(req, res, next) {
    var username = req.body.user_name;
    var password = req.body.password;
    var pass = crypto.createHash('md5').update(password).digest('hex');
    req.users.findOne({
        "username": username,
    }, function(err, docs) {
        if (err) {
            res.json("Your username is not exist");
        } else if (pass == docs.password) {
            var now = moment().format("YYYY-MM-DD'T'HH:mm:ss:SSSZ"); // save date in proper format....
            var loginRecord = new req.access_token({
                "userid": docs._id,
                "token": now
            });
            loginRecord.save(function(err, details) {
                if (err) {
                    next("invalid login");
                } else {
                    res.json({ status: 1, message: "data saved" })
                }
            });

        } else {
            res.status(500).send({ status: 0, message: "Invalid password" });
        }
    });
});

<!--------- fetch data from mongodb through url -------->

router.get('/user/get/:access_token', function(req, res) {
    var access_token = req.params.access_token;
    req.users.findOne({
        "_id": req.token,
    }, function(err, data) {
        if (err) {
            res.json("Invalid token");
        } else {
            res.json(data);
        }
    });
});
module.exports = router;
