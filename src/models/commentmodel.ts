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

// Field for likes as an array of strings
  likes: {
    type: [String]
  },

// Field for dislikes as an array of strings
  dislikes: {
    type: [String]
  }

}, {
  timestamps: true, // Timestamps for createdAt and updatedAt
});

// Create and export the Comment model using the schema
export const CommentModel = mongoose.model('Comment', commentSchema);
