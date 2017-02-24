var express = require('express'); //require express module
var app = express(); //creatig insatnce of express function
var mongoose = require('mongoose'); //require moongose module
var bodyParser = require('body-parser');
var db = require('./mongodb/db.js'); // create route for database
var routes = require('./routes/index.js'); //create route for index
var validate = require("./routes/validate.js"); //create route for validate

app.use(bodyParser.urlencoded({ extended: true })); //urlencoded within bodyParsar , extract data from <form> element
app.use(bodyParser.json());
app.use(db());
app.use('/', routes);

// Listen to this Port
app.listen(8080, function() {
    console.log("Server started at port number: 8080");
});
