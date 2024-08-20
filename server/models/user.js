const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
/*

const mongoose = require('mongoose');

/const postSchema = new mongoose.Schema({{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
});

const Post = mongoose.model('Post', postSchema);

*/
