var moment = require('moment');
module.exports = function(req, res, next) {
    var username = req.body.user_name;
    if(username==null){
        var access_token = req.url.split("/");
        var startDate=moment(access_token[3],"YYYY-MM-DD'T'HH:mm:ss:SSSZ");
        var endDate = moment();
        var Difference= endDate.diff(startDate);
        if(Difference < 60*60*1000){
            req.users.findOne({
               _id: access_token[3]
            },function(err, result) {
            if (err) {
                res.json('you are not authenticated');
            }else {
                next();
            }
            })
        }else{
        	res.json('you are not authenticated');
        }
    }else{
        next();
    }
};
