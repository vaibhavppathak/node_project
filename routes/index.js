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
    if ((username.length > 0) && (password.length > 0) && (cpassword.length > 0) && (email.length > 0) && (firstname.length > 0) && (lastname.length > 0)) {
        if (password == cpassword) {
            var pass = crypto.createHash('md5').update(password).digest('hex');
            var record = new req.users({
                "username": username,
                "password": pass,
                "email": email,
                "firstname": firstname,
                "lastname": lastname,
            });
            record.save(function(err, details) {
                if (err) {
                    req.err = "user already exist";
                    next(req.err);
                } else {
                    res.json({ status: 1, message: "record sucessfully inserted" })
                }
            });
        } else {
            req.err = "password not matched";
            next(req.err);
        }
    } else {
        req.err = "all fields are necessary";
        next(req.err);
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
            var now = moment().unix().toString(); // save date in proper format....
            var token = crypto.createHash('md5').update(now).digest('hex');
            console.log(token);
            var expiry = moment().unix() + 60 * 60;
            var loginRecord = new req.access_token({
                "userid": docs._id,
                "token": token,
                "expiry": expiry
            });
            loginRecord.save(function(err, details) {
                if (err) {
                    req.err = "invalid login";
                    next(req.err);
                } else {
                    res.json({ status: 1, message: "data saved" })
                }
            });

        } else {
            req.err = "invalid password";
            next(req.err);
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
            req.err = "invalid token";
            next(req.err);
        } else {
            res.json(data);
        }
    });
});

<!---- Delete data from mongodb through url  ----->
router.get('/user/delete/:access_token', function(req, res) {
    var token = req.params.access_token;
    req.users.findOne({ "_id": token }, function(err, data) {
        if (err) {
            req.err = "Invalid token";
            next(req.err)
        } else if (data != null) {
            data.remove()
            res.json("Data removed from mongodb");
        } else {
            req.err = "data not found";
            next(req.err);
        }
    });
});

<!----------- Pagination --------->
router.get('/user/list/:page', function(req, res) {
    var page = req.params.page;
    var per_page = 10;
    req.users.find().skip((page - 1) * per_page).limit(per_page).exec(function(err, data) {
        if (err) {
            req.err = "invalid page"
            next(req.err);
        } else {
            res.json({ data: data });
        }
    });
});

module.exports = router;
