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
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    req.users.findOne({
        "username": username,
        "password": password
    }, function(err, docs) {
        if (err) {
            res.json("Your username is not exist");
            next();
        } else if (docs) {
            var token = jwt.sign({ token: docs._id }, "xxx", { expiresIn: 60 * 60 });
            res.json({ status: 1, token: token, messgae: "login sucessfully" })
            next();
        } else {
            req.err = "invalid password or username";
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
    var count;
    req.users.count({}, function(error, num) {
        count = num;
    });
    req.users.find().skip((page - 1) * per_page).limit(per_page).exec(function(err, data) {
        if (err) {
            req.err = "invalid page"
            next(req.err);
        } else if (data) {
            res.json({ data: data, count: count });
        } else {
            req.err = "invalid user"
            next(req.err)
        }
    });
});

module.exports = router;
