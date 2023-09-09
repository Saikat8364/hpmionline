const mysql=require("mysql");

//MySQL Connection
var connection = mysql.createConnection({
    host: "localhost",
      // port:"3306",
    user: "root",
    password: "Saikat@8364",
    database: "hpmionline",
  });
connection.connect(function(err){
    if(err) throw err;
    console.log('Connection Successfull!');
});

module.exports = connection;