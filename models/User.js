const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true },
  email:{type:String,required:true},
  image:{type:String},
  bio:{type:String},
  role:{type:String},
  imdb:{type:String},
  projects:{type:Array},

});

const User = mongoose.model('User', userSchema);

module.exports = User;