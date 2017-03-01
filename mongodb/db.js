// the middleware function
module.exports = function() {
    var mongoose = require('mongoose'); //require mongoose module
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var conn = mongoose.connect('mongodb://127.0.0.1/Project'); //connection to mongodb

    // create schema 
    var userSchema = mongoose.Schema({
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        address: [{ type: Schema.Types.ObjectId, ref: 'address' }]
    }, {
        collection: 'users'
    });

    var user_address = mongoose.Schema({
        user_id: { type: String, required: true, ref: 'users' },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pin_code: { type: String, required: true },
        phone_no: { type: String, required: true },
    }, {
        collection: 'address'
    });


    var loginSchema = mongoose.Schema({
        userid: { type: String, required: true, index: { unique: true } },
        token: { type: String, required: true },
        expiry: { type: String, required: true }
    }, {
        strict: true,
        collection: 'access_token'
    });


    var user_create = conn.model('users', userSchema);
    var access_token = conn.model('access_token', loginSchema);
    var user_address = conn.model('address', user_address);
    return function(req, res, next) {
        req.users = user_create;
        req.access_token = access_token;
        req.user_address = user_address;
        next();
    }
}
