import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 15,
      maxlength: 50,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    tags: [{
      type: String,
      maxlength: 10,
      required: false
    }],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    comments: [{
        body: String,

        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        comment_id: {
          type: Schema.Types.ObjectId,
          ref: 'Comment',
        },
      }],
  }, 
  {
    timestamps: true, 
  }
);

export const PostModel = mongoose.model('Post', PostSchema);

/**
 * interface Comment {
    body: string;
    user_id?: mongoose.Types.ObjectId;
    comment_id?: mongoose.Types.ObjectId;
}

// Define the Post interface that extends Document
interface Post extends Document {
    title: string;
    content: string;
    author: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
}
 */
