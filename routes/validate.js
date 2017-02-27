var path = require("path");
var moment = require("moment");
module.exports = function(req, res, next) {
    var token = req.param("accessToken");
    if (req.path != "/user/login" && req.path != "/user/register") {
        req.access_token.findOne({
            userid: token
        }, function(err, result) {
            if (err) {
                res.status(400).send({ error: "You are not authenticated" });
            } else if (!result) {
                res.status(400).send({ error: "You are not authenticated" });
            } else {
                var startDate = parseInt(result.expiry);
                var endDate = moment().unix();
                var difference = startDate - endDate;
                if (difference >= 0) {
                    req.token = result.userid;
                    next();
                } else {
                    req.access_token.findOne({ "token": result.token }, function(err, data) {
                        if (err) {
                            req.err = 'invalid token'
                            next(req.err)
                        } else if (data != null) {
                            data.remove()
                            res.json("token expired");
                        } else {
                            req.err = 'invalid token'
                            next(req.err)
                        }
                    });
                }
            }
        })
    } else {
        next()
    }
};
