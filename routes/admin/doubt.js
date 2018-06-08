const express = require('express');
const router = express.Router();
const {isEmpty} = require('../../helpers/uploadhelper');
const Course = require('../../models/course');
const User = require("../../models/User");
const Question = require('../../models/question');
const Answer = require('../../models/answers');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/',function(req,res){
    Course.find({}).then(function(course){
        res.render('admin/doubt/doubt',{course: course})
    });
    
});
router.post('/:id',function(req,res){
    let filename = '';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + file.name;
        file.mv('./public/uploads/'+filename,function(err){
            if(err) return err;
        });
        User.findOne({_id: req.params.id}).then(function(user){
            const question = new Question({
                course: req.body.course,
                question: req.body.question,
                file: filename,
                name : user.name
            });
            question.save().then(function(result){
                res.redirect('/admin/doubt/allq');
            })
        })
        
    }else{
        User.findOne({_id: req.params.id}).then(function(user){
            const question = new Question({
                course: req.body.course,
                question: req.body.question,
                name: user.name,
                file: "no"
            });
            question.save().then(function(result){
                res.redirect('/admin/doubt/allq');
            })
        })
        
    }
    
});
router.get('/allq',function(req,res){
    Question.find({}).sort({"date":-1}).populate('course').then(function(questions){
        Course.find({}).then(function(course){
            res.render('admin/doubt/alldoubt',{questions: questions, course: course});
        })
        
    })
});
router.get('/course/:id',function(req,res){
    Question.find({course: req.params.id}).sort({"date":-1}).populate('course').then(function(questions){
        res.render('admin/doubt/course',{questions: questions});
    })
});
router.get('/download/:id',function(req,res){
    Question.findOne({_id: req.params.id}).then(function(question){
        var file = __dirname + '/../../public/uploads/'+question.file;
        res.download(file);
    });
})
router.get('/answer/:id',function(req,res){
    Question.findOne({_id: req.params.id}).populate('course').populate({path:'answers',populate: {path: 'user',model: 'user'}}).then(function(question){
        res.render('admin/doubt/answer',{question: question});
    })
});
router.post('/answer/submit/:id',function(req,res){
    Question.findOne({_id: req.params.id}).then(function(question){
        let filename = '';
        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = Date.now() + file.name;
            file.mv('./public/uploads/'+filename,function(err){
                if(err) return err;
            });
            const answer = new Answer({
                user : req.user.id,
                body: req.body.body,
                file: filename
            });
            question.answers.push(answer);
            question.save().then(function(result){
                answer.save().then(function(result){
                    res.redirect('/admin/doubt/answer/'+req.params.id);
                })
            })
        }else{
            const answer = new Answer({
                user : req.user.id,
                body: req.body.body,
                file: "no"
            });
            question.answers.push(answer);
            question.save().then(function(result){
                answer.save().then(function(result){
                    res.redirect('/admin/doubt/answer/'+req.params.id);
                })
            })
        }
        
    })
})
router.get('/download/answer/:id',function(req,res){
    Answer.findOne({_id:req.params.id}).then(function(answer){
        const file = __dirname +'/../../public/uploads/'+answer.file;
        res.download(file);
    })
})
router.post('/aaq/search',function(req,res){
    Question.find({$or:[{"question":{$regex : ".*"+req.body.search+".*"}},
    {"name":{$regex : ".*"+req.body.search+".*"}}]}).sort({"date":-1}).populate('course').then(function(questions){
        Course.find({}).then(function(course){
            res.render('admin/doubt/alldoubt',{questions: questions,course: course});
        })
        
    })
})
module.exports = router;
