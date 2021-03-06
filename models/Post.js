const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
    course:{
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    name:{
        type: String
    },
    comment:{
        required : true,
        type: String,
    },
    file:{
        type:String,
    },
    date :{
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('posts',Post);