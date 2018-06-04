const mongoose = require('mongoose');
const User = mongoose.model('users',{
    firstName:{
        required: true,
        type: String,
    },
    lastName:{
        required: true,
        type: String,
    },
    email:{
        required: true,
        type: String,
    },
    password:{
        required : true,
        type: String,
    },
    branch:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    club:{
        type: String
    },
    name:{
        type: String
    },
    profile:{
        image:{
            type: String
        },
        bio:{
            type: String
        },
        room:{
            type:String
        },
        club:{
            type:String
        },
        position:{
            type:String
        },
        project:{
            type:String
        },
        clubi:{
            type:String
        },
        pastprojects:{
            type:String
        },
        intern:{
            type:String
        },
        sports:{
            type:String
        }
    }
});
module.exports = User;