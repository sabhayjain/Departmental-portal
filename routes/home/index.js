const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
router.all('/*',function(req,res,next){
    req.app.locals.layout = 'home';
    next();
});
router.get('/',function(req,res){
    res.render('home/index');
})
router.get('/about',function(req,res){
    res.render('home/about');
})
router.get('/login',function(req,res){
    res.render('home/login');
});
passport.use(new localStrategy({usernameField:'email'},function(email,password,done){
     User.findOne({email:email}).then(function(user){
         if(!user) return done(null,false,{message: 'No user found'});
        bcrypt.compare(password,user.password,function(err,matched){
            if(err) return err;
            if(matched){
                return done(null,user);
            }
            else{
                return done(null,false,{message: 'incorrect password'});
            }
        })
         
     })
 }));
 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
 router.post('/login',function(req,res,next){
     passport.authenticate('local',{
         successRedirect: '/admin',
         failureRedirect: '/login',
         failureFlash: true
     })(req,res,next);
 })
router.get('/register',function(req,res){
    res.render('home/register');
});
router.post('/register',function(req,res){

    let errors = [];
    
    if(!req.body.firstName) errors.push({message: 'please enter first name'});
    if(!req.body.lastName) errors.push({message: 'please enter last name'});
    if(!req.body.email) errors.push({message: 'please enter email'});
    if(!req.body.password) errors.push({message: 'please enter password'});
    if(!req.body.passwordConfirm) errors.push({message:'please enter the password again'});
    if(req.body.password != req.body.passwordConfirm) errors.push({message:'password did not match'});
    if(errors.length>0){
        console.log(errors);
        res.render('home/register',{errors: errors});
    }else{
        User.findOne({email:req.body.email}).then(function(user){
            if(! user){
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    branch: req.body.branch,
                    year: req.body.year
        
                });
                bcrypt.genSalt(10,function(err,salt){
                    bcrypt.hash(user.password,salt,function(err,hash){
                        user.password = hash;
                            user.save().then(function(data){
                                res.redirect('/login');
                        });
                    });
                })
            }
            else{
                req.flash('error_message',"email exists");
                res.redirect('/login');
            }
        });
        
    }
        
    
    
})
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
module.exports = router;