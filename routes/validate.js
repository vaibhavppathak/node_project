var path = require("path");
module.exports = function(req, res, next) {
    var token = req.url.split("/");
    console.log(token[3])
    if (req.method != "POST") {
        req.access_token.findOne({
            userid: token[3]
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
        next();
    }
};
