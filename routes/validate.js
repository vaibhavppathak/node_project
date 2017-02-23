   module.exports = function(req, res, next) {
  var access_token = req.params.access_token;
   // console.log(access_token);
   req.users.findOne({
     _id: access_token
   }, function(err, res1) {
     if (err) {
       res.json('you are not authenticated');
     }
     if (!res1) {
       res.json('you are not authenticated');
     } else {
       next();
     }
   })
 };