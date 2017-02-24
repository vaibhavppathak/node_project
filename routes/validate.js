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
                var startDate = moment(result.token, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
                var endDate = moment();
                var difference = endDate.diff(startDate);
                console.log(difference);
                if (difference < 60 * 60 * 1000) {
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
