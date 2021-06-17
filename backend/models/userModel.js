var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {type:String, 
        required:true, 
        unique:true
    },
    role: { type: String, 
        enum: ['admin', 'user'] 
    },
    password: String,
    username : {type:String, 
        required:true, 
        unique:true
    },
    isDeleted : Boolean,
    profilePicUrl : String
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);