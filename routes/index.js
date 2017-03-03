var express = require('express'); // Require express module
var app = express()
var mongoose = require('mongoose'); //Require mongoose module
var router = express.Router(); //creatig insatnce of express function
var crypto = require('crypto'); // Require crypto module for encryption
var moment = require("moment");
var jwt = require('jsonwebtoken');
var async = require("async");
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
    req.user_address.find().populate('user_id').exec(function(err, users) {
        if (err) {
            req.err = "Data not fetched";
            next(req.err)
        } else {
            res.json({ status: 1, message: "Data fetched Successfully" })
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
    req.users.count({}, function(error, num) {
        req.users.find().skip((page - 1) * per_page).limit(per_page).exec(function(err, data) {
            if (err) {
                req.err = "invalid page"
                next(req.err);
            } else if (data) {
                res.json({ data: data, count: num });
            } else {
                req.err = "invalid user"
                next(req.err)
            }
        });
    });
});
<!-----------Sorting of data-------------->
router.get('/user/sort/:column/:type/:page', function(req, res, next) {
    var column = req.params.column;
    var type = req.params.type;
    var page = req.params.page;
    per_page = 10;
    var query = {}
    query[column] = type;
    req.users.find().sort(query).skip((page - 1) * per_page).limit(per_page).exec(function(err, data) {
        if (err) {
            req.err = "invalid page"
            next(req.err);
        } else if (data) {
            res.json({ data: data });
        } else {
            req.err = "invalid user"
            next(req.err)
        }
    });
});

<!------------searching of data-------------->
router.get('/user/search/:keyword', function(req, res, next) {
    var keyword = req.params.keyword;
    req.users.find({ '$or': [{ firstname: new RegExp(keyword, 'i') }, { lastname: new RegExp(keyword, 'i') }, { username: new RegExp(keyword, 'i') }, { email: new RegExp(keyword, 'i') }] }).populate('user_id').exec(function(err, users) {
        if (err) {
            req.err = "Data not fetched";
            next(req.err)
        } else {
            var detail = [];
            async.eachSeries(users, function(error, result) {
                req.user_address.find({ userid: users._id }).exec(function(error, data) {
                    if (error) {
                        req.err = "some error"
                        next(req.err)

                    } else if (!data) {
                        req.err = "data not fount"
                        next(req.err)
                    } else {
                        res.json({ status: 1, users: users, address: data })
                    }
                });
            });
        }
    });
});



module.exports = router;
