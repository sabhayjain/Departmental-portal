const express = require('express');
const router = express.Router();
const {userauthenticate} = require('../../helpers/userauthenticate');
router.all('/*',userauthenticate,function(req,res,next){
    req.app.locals.layout = 'admin';
    next();
});
router.get('/',function(req,res){
    res.render('admin/index');
});
module.exports = router;