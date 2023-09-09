const passport = require('passport');
function requireAuth(req,res,next){
    if (req.isAuthenticated()) { return next() }
    res.send("<script>alert('Please Login'); window.location.href = '/login'; </script>");    
  }
module.exports=requireAuth;