// the middleware function
module.exports = function() {
    var mongoose = require('mongoose'); //require mongoose module
    var conn = mongoose.connect('mongodb://127.0.0.1/Project'); //connection to mongodb
    
    // create schema 
    var userSchema = mongoose.Schema({
        username:{type:String,required:true,index:{unique:true}},
        password:{ type: String, required: true },
        email : {type:String,required:true,index:{unique:true}},
        firstname:{ type: String, required: true },
        lastname: { type: String, required: true },
    },{
        strict: true,
        collection: 'users'
    });
    var user = conn.model('USERS', userSchema);

    return function(req, res, next) {
        req.users = user;
        next();
    }
}