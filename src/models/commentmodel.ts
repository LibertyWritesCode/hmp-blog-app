import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: [{
    type: String
  }],
  comment_id: {
    type: Schema.Types.ObjectId
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true 
});

export const CommentModel= mongoose.model('Comment', commentSchema);
