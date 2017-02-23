var crypto =require('crypto');
module.exports = function(req, res, next) {
	var username = req.body.user_name;
	if(username==null){
	var token = req.url.split("/");
		req.login.findOne({
			token: token[3]
		},function(err, res1) {
			if (err) {
				res.json('you are not authenticated');
			} else if(!res1){
				res.json('you are not authenticated');
			}else {
				req.token=res1.userid;
				next();
			}
		})
	}else{
		next();
	}
};
