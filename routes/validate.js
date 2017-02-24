var path = require("path");
var moment = require("moment");
module.exports = function(req, res, next) {
    var token = req.url.split("/");
    if (req.method != "POST") {
        var startDate = moment(token[3], "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
        var endDate = moment();
        var Difference = endDate.diff(startDate);
        if (Difference < 60 * 60 * 1000) {
            req.access_token.findOne({
                token: token[3]
            }, function(err, res1) {
                if (err) {
                    res.json('you are not authenticated');
                } else if (!res1) {
                    res.json('you are not authenticated');
                } else {
                    req.token = res1.userid;
                    next();
                }
            })
        } else {
            res.json("not authenticated");
        }
    } else {
        next();
    }
};
