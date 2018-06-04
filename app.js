const express = require('express');
const app = express();
const path = require('path');
const exphb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
mongoose.Promise = global.Promise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
mongoose.connect('mongodb://localhost:27017/cms');
mongoose.connection  
                .once('open',function(){console.log("CONNECTED");})
                .on('error',function(err){console.log("DISCONNECTED",err);});
app.use(express.static(path.join(__dirname +'/public')));
const {select,isequal} = require('./helpers/handlebar-helper');
app.engine('handlebars',exphb({defaultLayout: 'home', helpers: {select:select,isequal: isequal}}));
app.set('view engine','handlebars');
app.use(session({
    secret: 'ilovecoding',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.error_message = req.flash('error_message');
    next();
});

app.use(upload());
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const profile = require('./routes/admin/profile');
const seniors = require('./routes/admin/seniors');
const student = require('./routes/admin/student');
app.use('/',home); 
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/profile',profile);
app.use('/admin/seniors',seniors);
app.use('/admin/search',student);
const port = 5555 || process.env.PORT;
app.listen(port,function(){
    console.log("listening"); 
});     