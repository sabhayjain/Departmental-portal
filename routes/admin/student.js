const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const User = require('../../models/User');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/',function(req,res){
    MongoClient.connect(url,{ useNewUrlParser: true } ,function(err, db) {
        if (err) throw err;
        var dbo = db.db("cms");
        dbo.collection("users").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.render('admin/search/student',{result:result});
          db.close();
        });
      });
});
router.post('/',function(req,res){
    User.findOne({name: req.body.name}).then(function(user){
         res.render('admin/search/profile',{user:user});
     });
    
});
module.exports = router;