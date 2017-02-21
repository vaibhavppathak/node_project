var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();  //creatig insatnce of express function
var uniqueValidator = require('mongoose-unique-validator');
var crypto =require('crypto');
var http = require('http');
var app=express();
var validate=require("./validate.js")


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

<!--------- login -------->

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
        res.status(500).send({ error: "invalid password" });
      }
    }  
  });
});
<!--------- fetch data from mongodb through url -------->
router.get('/user/get/:id', function(req, res) {
  var id=req.params.id;
  validate(id,req.users,function(err,resp){
    if(err=="error"){
      res.json({status:0,message:"invalid token"})
    }else
    res.json(resp);
  });
})

<!----------- delete data from mongodb through url -------->

router.get('/user/delete/:id', function(req, res) {
  var id=req.params.id;
  validate(id,req.users,function(err,resp){
    if(!(err=="error")){
      req.users.remove({
        _id: id
      }, function(err, result) {
        if (err) {
          res.json(err);
        } else {
            var parsed = JSON.parse(result); // parsing json result...
            if (parsed.n == 1) {
              res.json("data removed")
            } else {
              res.json("data not found");
            }
          }
        });
    }else{
      res.json({status:0,message:"invalid token"})
    }
  })
});

<!----- fetching data by page number  ---->

router.get('/user/list/:page', function(req, res) {
  var number=(req.params.page-1)*10;
  console.log(number);
  req.users.find(null, null, {
         skip: number,
         limit: 10
      }, function (err, data) {
         if(err) {
            res.json(500, err);
         }
         else {
            res.json({data: data});
         }
      });
})
module.exports = router;