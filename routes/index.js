var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();  //creatig insatnce of express function
var crypto =require('crypto');

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
            var record = new req.users({
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
        }else if(pass == docs.password){
          var access_token=docs._id;
            res.json({'access_token':docs._id});  
        }else{
            res.status(500).send({status:0,message:"Invalid password"});
        }  
    });
});

router.get('/user/get/:access_token', function(req, res) {
  var access_token = req.params.access_token;
  req.users.findOne({
   "_id": access_token,
  },function(err, data){
    if (err) {
      res.json("Invalid token");
    }else {
      res.json(data);
    }
  });
});

<!----- Delete data from mongodb through url  ----->
router.get('/user/delete/:access_token', function(req, res) {
  var access_token= req.params.access_token;
  validate(access_token,req,function(err,result){
    if(err=="error"){
     res.json({status:0,message:"invalid token"})
    }else{
      req.users.findOne({"_id": access_token},function (err, data) {             
        if(err){
          res.json("User not found");
        }else{     
          data.remove() 
          res.json("Data removed from mongodb"); 
        }
      });
    }
  });
  function validate(access_token,req,callback) {
    req.users.findOne({
     "_id": access_token,
    },function(err, docs) {
      if (err) {
       callback('error',err);
      }else {
       callback("result",docs);
      }
    });
  }
}); 


<!----------- Pagination --------->
router.get('/user/list/:page', function(req, res) {
  var page=req.params.page;
  var per_page=10;
  req.users.find().skip((page-1)*per_page).limit(per_page).exec(function(err, data) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        }else {
          res.json({data: data});
        }
    });
}); 
module.exports = router;