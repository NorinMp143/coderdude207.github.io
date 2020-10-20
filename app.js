const bodyParser=require('body-parser');
const express=require('express');
const session=require('express-session');
const path=require('path');
var app=express()
const port= 8000
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'users',
  comment: 'comment'
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../sms'))
app.set('view engine','ejs')
connection.connect(function(err){
    if(err) throw err;
    console.log('Connected..');
})
app.get('/',function(req,res){
res.sendFile('home.html',{root:__dirname})
});
app.post('/registered',function(req,res){
    var sql="insert into data(ID,name,phone,email,password) values(NULL,'"+req.body.name+"','"+req.body.phone+"','"+req.body.email+"','"+req.body.password+"')";
    connection.query(sql,function(err){
    if(err) throw err;
        else{
    res.sendFile('login.html',{root:__dirname});
    console.log('Record Added Successfully.')
        }
    });
});
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
app.post('/auth',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    if(email && password){
        connection.query('SELECT * FROM data WHERE email = ? AND password = ?',[email,password],function(error,results,fields)
        {
           if(results.length>0){
               req.session.loggedin=true;
               req.session.email=email;
               
                   var id=JSON.stringify(results[0].ID)
                   var name=JSON.stringify(results[0].name)
                   var phone=JSON.stringify(results[0].phone)
                   var email=JSON.stringify(results[0].email)
                   res.render('student',{
                       id:id,
                       name:name,
                       phone:phone,
                       email:email,
                       aa:100,
                       nos:2,
                       sub1: 100,
                       sub2:100,
                       subs:2,
                       ca1:30,
                       ca2:30
                   })
               }
            
            else
                {
                    res.send('Incorrect Username and/or Password!<br><a href="login.html">Go back</a>');
                }
        });
    }
    else{
        res.send('Please enter Username and Password!');
       res.end();
    }

});
app.listen(port,()=>console.log(`Example app listening on port ${port}!`));

