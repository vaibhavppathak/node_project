var path = require("path");
var moment = require("moment");
module.exports = function(req, res, next) {
    var token = req.url.split("/");
    if (req.path != "/user/login" && req.path != "/user/register") {
        req.access_token.findOne({
            userid: token[3]
        }, function(err, result) {
            if (err) {
                res.json('you are not authenticated');
            } else if (!result) {
                res.json('you are not authenticated');
            } else {
                var startDate = parseInt(result.expiry);
                var endDate = moment().unix();
                var difference = startDate - endDate;
                if (difference >= 0) {
                    req.token = result.userid;
                    next();
                } else {
                    res.json("token expired");
                }
            }
        })
    } else {
        next()
    }
};
