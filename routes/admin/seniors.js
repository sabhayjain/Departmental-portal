const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const User = require('../../models/User');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/:id',function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
        var interest = user.profile.clubi;
        console.log(user.club);
        MongoClient.connect(url,{ useNewUrlParser: true } ,function(err, db) {
            if (err) throw err;
            var dbo = db.db("cms");
            dbo.collection("users").find({club:interest}).toArray(function(err, result) {
              if (err) throw err;
              res.render('admin/senior/senior',{result:result});
              db.close();
            });
          }); 
    });
});
router.get('/show/:id',function(req,res){
    User.findOne({_id:req.params.id}).then(function(user){
        res.render('admin/senior/profile',{user:user});
    });
});
 
module.exports = router;