const mongoose = require("mongoose");

const posts = new mongoose.Schema({
  postsUrl:String,
  filename: String,
  contentType:String,
  image:String,
  postedBy : {type:mongoose.Schema.Types.ObjectId, ref:'registration'}
});

const postsModel = mongoose.model("posts", posts);

module.exports = postsModel;