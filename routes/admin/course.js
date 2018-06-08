const express = require('express');
const router = express.Router();
const course = require('../../models/course');
const User = require("../../models/User");
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/',function(req,res){
    res.render('admin/course/course');
});
router.post('/:id',function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
        const Course = new course({
            course: req.body.course
        });
        Course.save().then(function(result){
            req.flash('course_added',req.body.course+" is added to the course list")
            res.redirect('/admin');
        })
    })
    
})
module.exports = router;