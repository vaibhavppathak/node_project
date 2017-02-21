module.exports = function (mongoid,users,callback) {
		users.findOne({
           "_id": mongoid,
        },function(err, docs) {
        if (err) {
        	callback('error',err);
        }else {
          callback("result",docs)
        }
    });

}