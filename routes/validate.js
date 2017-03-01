var path = require("path");
var moment = require("moment");
var express = require('express'); // Require express module
var app = express();
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.param("accessToken");
    if (token) {
        var decoded = jwt.verify(token, "xxx");
        console.log(decoded)
        var endTime = moment().unix();
        var loginTime = decoded.exp;
        console.log(endTime);
        console.log(decoded.exp);
        if (decoded.exp > endTime) {
            req.token = decoded.access_token;
            next();
        } else {
            req.err = "Token expire"
            next(req.err);
        }
    } else {
        next()
    }
};
