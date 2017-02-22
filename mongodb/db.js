// the middleware function
module.exports = function() {
    var mongoose = require('mongoose'); //require mongoose module
    var uniqueValidator = require('mongoose-unique-validator');
    var conn = mongoose.connect('mongodb://127.0.0.1/Project'); //connection to mongodb
    
    // create schema 
    var usercreate = mongoose.Schema({
        username:{type:String,required:true,index:{unique:true}},
        password:{ type: String, required: true },
        email : {type:String,required:true,index:{unique:true}},
        firstname:{ type: String, required: true },
        lastname: { type: String, required: true },
    }, {
        strict: true,
        collection: 'users'
    });
    // create schema 
    var userfetch = mongoose.Schema({
        username:{type:String,required:true},
        password:{ type: String, required: true },
    }, {
        strict: true,
        collection: 'users'
    });

    // Apply the uniqueValidator plugin to userSchema. 
    usercreate.plugin(uniqueValidator, { message: 'Error, username && email should be unique.' });
    userfetch.plugin(uniqueValidator);
    var users = conn.model('create', usercreate);
    var userfetch = conn.model('fetch', userfetch);

    return function(req, res, next) {
        req.usercreate = usercreate;
        req.userfetch = userfetch;
        next();
    }
}