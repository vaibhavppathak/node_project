module.exports = function(req, res, next) {
	var token = req.url.split("/");
	if(token[3]){
		req.users.findOne({
			_id: token[3]
		},function(err, res1) {
			if (err) {
				res.json('you are not authenticated');
			} else if(!res1){
				res.json('you are not authenticated');
			}else {
				next();
			}
		})
	}else{
		next();
	}
};
