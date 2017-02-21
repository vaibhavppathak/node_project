module.exports = function (token) {
   var access_token=[];
   console.log(token)
   access_token.push(token);
   return function (req, res, next) {
        req.token=access_token;
        next(); //call next middleware
   }
}