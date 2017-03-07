var path = require("path");
var moment = require("moment");
var express = require('express'); // Require express module
var app = express();
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.param("accessToken")
    if ((req.path != "/user/login" && req.path != "/user/register" && req.path != "/favicon.ico")) {
        var decoded = jwt.verify(token, "xxx");
        var endTime = moment().unix();
        var loginTime = decoded.exp;
        if (decoded.exp > endTime) {
            req.user_id = decoded.token;
            next();
        } else {
            req.err = "Token expire"
            next(req.err);
        }
    } else {
        next()
    }
};
