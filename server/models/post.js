const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [
      {
        text: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    default: [],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
});
const PostModel = mongoose.model("post", postSchema);

//PostModel.create({ body: 'post content', title: 'example title' })
module.exports = { PostModel };
