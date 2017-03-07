var path = require("path");
var moment = require("moment");
var express = require('express'); // Require express module
var app = express();
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.param("accessToken")
    if ((req.path != "/user/login" && req.path != "/user/register" && req.path != "/favicon.ico")) {
        jwt.verify(token, "xxx", function(err, decoded) {
            if (err) {
                req.err = "token expired"
                next(req.err);
            } else {
                var endTime = moment().unix();
                var loginTime = decoded.exp;
                if (decoded.exp > endTime) {
                    req.user_id = decoded.token;
                    next();
                } else {
                    req.err = "Token expire"
                    next(req.err);
                }
            }
        });
    } else {
        next()
    }
};
