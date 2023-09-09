const passport = require('passport');
function authteacher(req,res,next){
    if (req.isAuthenticated()) { 
        if(req.user.role=='teacher'){
            return next() 
        } else {
            res.send("<script>alert('Please Login as Teacher'); window.location.href = '/home'; </script>");  
        }
    }
    res.send("<script>alert('Please Login'); window.location.href = '/login'; </script>");    
  }
module.exports=authteacher;