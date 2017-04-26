var express= require('express');
var bodyParser= require('body-parser');
var path=require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('myDb', ['users']);
var objectId=require('mongodb').ObjectID;;

var app=express();

/*var logger=function(req,res,next){
    console.log('Logging .......');
    next();
}*/
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//app.use(logger);
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Set Static path
app.use(express.static(path.join(__dirname,'public')))
//Global vars
app.use(function(req,res,next){
res.locals.errors=null;
next();
});



//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.get('/',function(req,res){
    // find everything
db.users.find(function (err, docs) {
	
    res.render('index',{
    title:'customers',
    people:docs
     });
   
})
   
    
    // docs is an array of all the documents in mycollection
});

app.post('/people/add',function(req,res){
    req.checkBody('first_name', 'First Name is Required .').notEmpty();
     req.checkBody('last_name', 'Last Name is Required .').notEmpty();
      req.checkBody('age', 'Age is Required .').notEmpty();
     
     var errors=req.validationErrors();

     if(errors){
            res.render('index',{
                title:'customers',
                 people:people,
                 errors:errors
     });
     }else{
    
           var User={
             first_name:req.body.first_name,
             last_name:req.body.last_name,
              age:req.body.age
    }
    db.users.insert(User,function(err,result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
     }
});
app.delete('/users/delete/:id',function(req,res){
    db.users.remove({_id:objectId(req.params.id)},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    });

});

app.listen(3000,function(){
    console.log('server started on port 3000 ....');
})