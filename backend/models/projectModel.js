var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    title: {type:String, 
        required:true
    },
    requirement: { type: String, require:true},
    // This field value will be _id of user from user table
    postedBy : {type:mongoose.Schema.Types.ObjectId, ref:'registration'},
    isDeleted : Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('project', projectSchema);