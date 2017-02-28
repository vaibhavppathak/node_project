var express = require('express'); // Require express module
var app = express()
var mongoose = require('mongoose'); //Require mongoose module
var router = express.Router(); //creatig insatnce of express function
var crypto = require('crypto'); // Require crypto module for encryption
var moment = require("moment");
var jwt = require('jsonwebtoken');
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
            next();
        } else if (docs && pass == docs.password) {
            var now = moment().unix().toString(); // save date in proper format....
            var token = jwt.sign({ access_token: docs._id }, "xxx");
            // sign(access_token, secret);
            // function sign(){

            // }
            // jwt.verify(token, app.get("superSecret"), function(err, decoded) {
            //     console.log(decoded)
            // });
            var expiry = moment().unix() + 60 * 60;
            var loginRecord = new req.access_token({
                "userid": docs._id,
                "token": token,
                "expiry": expiry
            });
            req.access_token.findOne({
                "userid": docs._id
            }, function(error, result) {
                if (!result) {
                    loginRecord.save(function(err, details) {
                        if (err) {
                            req.err = "invalid login";
                            next(req.err);
                        } else if (result) {
                            res.json({ status: 1, access_token: token, messgae: "login sucessfully" })
                            next()
                        } else {
                            req.err = "invalid login"
                            next()
                        }
                    });
                } else if (!error) {
                    req.access_token.findOneAndUpdate({ userid: docs._id }, { $set: { expiry: expiry } }, function(err1, res1) {
                        if (res1) {
                            res.json({ status: 1, access_token: token, messgae: "login sucessfully" })
                            next()
                        } else {
                            req.err = err1
                            next();
                        }
                    })
                }
            })
        } else {
            req.err = "invalid password";
            next(req.err);
        }
    });
});

<!--------- fetch data from mongodb through url -------->

router.get('/user/get', function(req, res, next) {
    req.users.findOne({
        "_id": req.token,
    }, function(err, data) {
        if (err) {
            req.err = "Invalid token";
            next(req.err)
        } else {
            res.json(data);
            next()
        }
    });
});

<!---- Delete data from mongodb through url  ----->
router.get('/user/delete', function(req, res, next) {
    req.users.findOne({ "_id": req.token }, function(err, data) {
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
router.get('/user/list/:page', function(req, res, next) {
    var page = req.params.page;
    var token = req.param('accessToken');
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
