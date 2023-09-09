import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comments: [{
        body: String,

        user_id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        
      }],
    likes: {
            type: Number,
            default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
});


export const CommentModel= mongoose.model('Comment', commentSchema);
