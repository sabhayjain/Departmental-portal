const mongoose = require('mongoose');
const Post = mongoose.model('posts',{
    course:{
        required: true,
        type: String,
        maxlength: 20
    },
    comment:{
        required : true,
        type: String,
    },
    file:{
        type:String,
    }
});
module.exports = Post;