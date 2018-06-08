const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'home';
    next();
});
router.get('/:id',function(req,res){
    Post.find({course: req.params.id}).sort({"date":-1}).populate('course').then(function(posts){
        res.render('home/categories',{posts:posts})
    })
})
module.exports = router;