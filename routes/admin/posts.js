const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const {isEmpty} = require('../../helpers/uploadhelper');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/',function(req,res){
    Post.find({}).then(function(posts){
        res.render('admin/posts/allposts',{posts:posts});
    })
    
});
router.get('/create',function(req,res){
    res.render('admin/posts/create');
});
router.post('/create',function(req,res){
    let filename = '';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + file.name;
        file.mv('./public/uploads/'+filename,function(err){
            if(err) return err;
        });
        const posts = new Post({
            course: req.body.course,
            comment: req.body.comment,
            file: filename
        });
        console.log(posts.course);
        posts.save().then(function(result){
            res.redirect('/admin/posts');
        }).catch(function(err){
            return err;
        });
    }
    else{
        const posts = new Post({
            course: req.body.course,
            comment: req.body.comment,
        });
        console.log(posts.course);
        posts.save().then(function(result){
            res.redirect('/admin/posts');
        }).catch(function(err){
            return err;
        });
    }
    
});
router.get('/edit/:id',function(req,res){

    Post.findOne({_id: req.params.id}).then(function(post){
        res.render('admin/posts/edit',{post:post});
    });
    
})
router.put('/edit/:id',function(req,res){
    Post.findOne({_id: req.params.id}).then(function(post){
        post.course = req.body.course;
        post.comment = req.body.comment;
        post.save().then(function(updatedData){
            res.redirect('/admin/posts');
        }).catch(function(err){
            return err;
        })
    });
});
router.delete('/:id', function(req,res){
    Post.remove({_id:req.params.id}).then(function(result){
        res.redirect('/admin/posts');
    }).catch(function(err){
        return err;
    })
})
module.exports = router;  