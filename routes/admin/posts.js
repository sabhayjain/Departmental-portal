const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const course = require('../../models/course');
const {isEmpty} = require('../../helpers/uploadhelper');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/:id',function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
        Post.find({name: user.name}).sort({"date":-1}).populate('course').then(function(posts){
            res.render('admin/posts/allposts',{posts:posts});
        });
    });
    
});
router.get('/download/:id',function(req,res){
    Post.findOne({_id: req.params.id}).then(function(post){
        var file = __dirname+'/../../public/uploads/'+post.file;
        res.download(file);
    });
});
router.get('/create/:id',function(req,res){
    course.find({}).then(function(course){
        res.render('admin/posts/create',{course: course});
    })
    
});
router.post('/create/:id',function(req,res){
    let filename = '';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + file.name;
        file.mv('./public/uploads/'+filename,function(err){
            if(err) return err;
        });
        User.findOne({_id: req.params.id}).then(function(user){
            const posts = new Post({
                name: user.name,
                course: req.body.course,
                comment: req.body.comment,
                file: filename
            });
            console.log(posts.course);
            posts.save().then(function(result){
                res.redirect('/admin/posts/'+user.id);
            }).catch(function(err){
                return err;
            });
        });
        
    }
    else{
        User.findOne({_id : req.params.id}).then(function(user){
            const posts = new Post({
                name: user.name,
                course: req.body.course,
                comment: req.body.comment,
            });
            console.log(posts.course);
            posts.save().then(function(result){
                res.redirect('/admin/posts/'+ user.id);
            }).catch(function(err){
                return err;
            });
        })
        
    }
    
});
router.get('/edit/:id',function(req,res){

    Post.findOne({_id: req.params.id}).then(function(post){
        course.find({}).then(function(course){
            res.render('admin/posts/edit',{post:post, course: course});
        })
    });
    
})
router.put('/edit/:un/:id',function(req,res){
    User.findOne({name : req.params.un}).then(function(user){
        Post.findOne({_id: req.params.id}).then(function(post){
            post.course = req.body.course;
            post.comment = req.body.comment;
            post.name = user.name;
            post.save().then(function(updatedData){
                res.redirect('/admin/posts/'+user.id);
            }).catch(function(err){
                return err;
            })
        });
    });
    
});
router.delete('/:un/:id', function(req,res){
    User.findOne({name:req.params.un}).then(function(user){
        Post.remove({_id:req.params.id}).then(function(result){
            res.redirect('/admin/posts/'+user.id);
        }).catch(function(err){
            return err;
        })
    })
    
})
module.exports = router;  