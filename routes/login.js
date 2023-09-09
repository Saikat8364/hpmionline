const express=require('express')
const passport = require('passport');
const auth = require('../reqauth.js');
const router=express.Router()
const home = require('./home.js');

router.get("/",(req,res)=>{
    res.render('login.ejs');
});
router.get('/failure',(req,res)=>{
    res.send("Login Failed");
});
router.post("/",passport.authenticate('local', {
    successRedirect: "/home",
    failureRedirect: "/login/failure",
}));

module.exports=router;