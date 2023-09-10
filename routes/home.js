const express=require('express')
const passport = require('passport');
const auth = require('../reqauth.js');
const authte = require('../authteacher.js');
const con = require('../database.js');
const con2 = require('../database2.js');
const { htmlPrefilter } = require('jquery');
const router=express.Router()

router.get('/',auth,function(req,res){
    if(req.user.role=='admin'){
        res.render('homeadmin.ejs',{name:req.user.name, username:req.user.name,id:req.user.id, role:req.user.role, email:req.user.email});
    }
    else if (req.user.role=='teacher'){
        var sql = 'select DISTINCT class from subject';
        con.query(sql,function(err,data){
            if (err) throw err;
            res.render('hometeacher.ejs',{name:req.user.name, username:req.user.name,id:req.user.id, role:req.user.role, email:req.user.email, data:data});
        });   
    }   
});

router.post('/',authte,function(req,res){
    var sql = `select id,name,class,section,roll from studentdb where class = ${req.body.cl} and section = '${req.body.section}';`;
    con.query(sql,function(err,result){
        if (err) throw err;
        res.render('markssa1',{term:req.body.SA, name:req.user.name, username:req.user.name,id:req.user.id, role:req.user.role, email:req.user.email, result:result,subject:req.body.subject, cl:req.body.cl, section:req.body.section});
    });
    
});

router.post('/markssa1',authte,function(req,res){
    var i = req.body.count;
    var sub = req.body.ssubject;
    for(var j =0 ; j<i; j++){
        var sid = req.body.sid[j];
        var as = parseFloat(req.body.as[j]);
        var bs = parseFloat(req.body.bs[j]);
        var ts = as+bs;
        var grade ="";
        if(ts>=90){
            grade="A+";
        }else if(ts<90 && ts>=80){
            grade="A"
        }else if(ts<80 && ts>=70){
            grade="B+"
        }else if(ts<70 && ts>=60){
            grade="B"
        }else if(ts<60 && ts>=50){
            grade="C+"
        }else if(ts<50 && ts>=40){
            grade="C"
        }else{
            grade="D";
        }
        try {
            var sql = `INSERT INTO marks_2023 (student_ID, subject, Term, ut, main, total, grade, uploadedby) VALUES ('${sid}', '${sub}', '${req.body.sterm}', '${as}', '${bs}', '${ts}', '${grade}', '${req.user.name}');`;
        con2.query(sql, function(err){
            if (err) throw err;
        })
        } catch (error) {
           console.log(err) 
        }
        finally{
            continue;
        }
        
    }
    res.redirect('/home');
});

router.post('/submitted_marks',authte,function(req,res){
    var sql = `select student_ID,name,roll,ut, main, total from marks_2023 join studentdb where marks_2023.student_ID = studentdb.id and class = '${req.body.tcl}' and section = '${req.body.tsection}' and subject = '${req.body.tsubject}' and term='${req.body.TSA}';`;
    con2.query(sql, function(err,result){
        if (err) throw err;
        res.render('submitted_marks',{term:req.body.TSA, name:req.user.name, username:req.user.name,id:req.user.id, role:req.user.role, email:req.user.email, result:result,subject:req.body.tsubject, cl:req.body.tcl, section:req.body.tsection})
    });
});

router.get('/check', function(req,res){
    var sql = `select * from class1a_sa1_marks;`
    con2.query(sql,function(err,result){
        if (err) throw err;
        console.log(result);
        res.send('Check Console Log')
    })
})

module.exports = router;