var express = require('express');
var app=express()
var mongoose = require('mongoose');
var router = express.Router();  //creatig insatnce of express function
var uniqueValidator = require('mongoose-unique-validator');
var crypto =require('crypto');
// var validate=require('./validate.js');

router.post('/user/register', function(req, res) {  
    var username = req.body.user_name;
    var password = req.body.password;
    var cpassword = req.body.confirm_password;
    var email = req.body.email;
    var firstname = req.body.first_name;
    var lastname = req.body.last_name; 
    var pass=crypto.createHash('md5').update(password).digest('hex');
    var cpass=crypto.createHash('md5').update(cpassword).digest('hex');
    if((username.length >0) && (password.length >0) && (cpassword.length >0) && (email.length >0)&&(firstname.length >0)&&(lastname.length >0)){
        if(pass == cpass) {
            var record = new req.Collection_user({
               "username": username,
               "password": pass,
               "email": email,
               "firstname": firstname,
               "lastname": lastname,
            });
            record.save(function(err,details) {
                if (err) {
                   res.json("Username or Email already exists");
                } else {
                   res.json("Record inserted successfully");
                }
            });
        }else{
         res.json("Password not matched")
        } 
    }else{
        res.json("All field must be filled out");
    }        
});

<!--------- fetch data from mongodb through url -------->

router.post('/user/login', function(req, res) {  
    var username = req.body.user_name;
    var password = req.body.password;
    var pass=crypto.createHash('md5').update(password).digest('hex');
    req.users.findOne({
        "username":username,
    }, function(err, docs) {
        if (err) {
            res.json("Your username is not exist");
        }else{
            if(pass == docs.password){
              res.json("Access_token"+":"+ docs._id);
            }else{
              res.json("Invalid Password");
            }
        }   
    });
});

router.get('/user/get/:access_token', function(req, res) {
  var access_token= req.params.access_token;
  validate(access_token,req,function(err,resp){
    if(err=="error"){
      res.json({status:0,message:"invalid token"})
    }else{
      res.json({status:0,userdata:resp});
    }
  });
});
function validate(token,req,callback) {
  req.users.findOne({
    "_id": token,
  },function(err, docs) {
    if (err) {
      callback('error',err);
    }else {
      callback("result",docs);
    }
  });
}

module.exports = router;