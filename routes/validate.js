var path = require("path")
module.exports = function(req, res, next) {
    var token = req.url.split("/");
    if (token[2] == "get") {
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
        next();
    }
};
