const mongoose = require("mongoose");

const registration = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    
  },
  role: {
    type: String,
    required: true,
    trim: true,
    
  },
  
  birthday: {
    type: String,
    required: true,
    trim: true,
    
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    
  },
  email: {
    type: String,
    required: true,
    trim: true,
    
  },
  phonenumber: {
    type: String,
    required: true,
    trim: true,
    
  },
  filename: String,
  contentType:String,
  image:String
});

const registrationModel = mongoose.model("registration", registration);

module.exports = registrationModel;