//Require Modules
const https = require("https");
const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var fs = require("fs");
const mysql=require("mysql");
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const con = require('./database.js');
const con2 = require('./database2.js');

//Require Routes
const login = require('./routes/login.js');
const home = require('./routes/home.js')

//App Middleware
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// This is the basic express session({..}) initialization.
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))

// init passport on every route call.
app.use(passport.initialize()) 

// allow passport to use "express-session".
app.use(passport.session()) 

//Use Routes
app.use('/login',login);
app.use('/home',home);

//Defining the strategy used to authenticate user
authUser = (req,user, password, done) => {
  var sql = 'Select id,name,username,role,email from '+req.body.loginop+' where username="'+user+'" and password="'+password+'"';
  con.query(sql,function(err,result){
    if (err) throw err;
    if(result.length>0){
      let authenticated_user = { id: result[0].id, name: result[0].name, username: result[0].username, role: result[0].role, email:result[0].email}
      return done (null, authenticated_user )
    }else{
      return done(null,false)
    }
  })
}

//Use the new Strategy
passport.use(new LocalStrategy ({passReqToCallback: true},authUser))

//Serialize User
passport.serializeUser(function(user, done) {     
  return done(null, user);
});

//Deserialize User
passport.deserializeUser(function(user, done) {
  return done(null, user);
});



//Root route redirects to login
app.get('/',function(req,res){
    res.redirect('/login');
});

app.get('/logout',function(req,res){
    req.logOut(function(err){
      if (err) throw err;
      res.redirect('/');
    });
    
});

app.get('/get_data',function(req,res,next){
  var type = req.query.type;
  var search_query = req.query.parent_value;

  if(type=='load_section'){
    var sql = `Select DISTINCT sec AS Data from subject WHERE class = '${search_query}';`;
  }

  if(type == 'load_subject'){
    var sql = `Select subject AS Data from subject WHERE class = '${search_query}';`;
  }
  con.query(sql,function(err,data){
    var data_arr =[];
    data.forEach(function(row) {
      data_arr.push(row.Data);
    });

    res.json(data_arr);
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function (){
  console.log("Server has started successfully.");
});