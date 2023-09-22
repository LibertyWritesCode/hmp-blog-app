import mongoose from "mongoose";

// Create a schema object using Mongoose's Schema class
const Schema = mongoose.Schema;

// Define the schema for the 'Comment' model
const commentSchema = new Schema({

// An array of comment bodies as strings
  comment: [{
    type: String
  }],

// Comment ID referencing the User model
  comment_id: {
    type: Schema.Types.ObjectId,
  },

// Field for likes
  likes: {
    type: Number,
    default: 0, // Default value of 0 for likes
  },

// Field for dislikes
  dislikes: {
    type: Number,
    default: 0, // Default value of 0 for dislikes
  }

}, {
  timestamps: true, // Timestamps for createdAt and updatedAt
});

// Create and export the Comment model using the schema
export const CommentModel = mongoose.model('Comment', commentSchema);
