import mongoose from "mongoose"; // Import Mongoose package for MongoDB

// Create a schema object using Mongoose's Schema class
const Schema = mongoose.Schema;

// Define the schema for the Post model
const PostSchema = new Schema({
    id: {
      type: Schema.Types.ObjectId
    },
// Field for title
    title: {
      type: String,
      required: true,     // Title is required
      minlength: 15,     // Minimum length of 15 characters
      maxlength: 50,     // Maximum length of 50 characters
    },
// Field for content
    content: {
      type: String,
      required: true,      // Content is required
    },

// An author field that references the 'User' model
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',          // Reference to the 'User' model
      required: true,
    },

// Tags field as an array of strings
    tags: [{
      type: String,
      maxlength: 10,       // Maximum length of each tag is 10 characters
      required: false,     // Tags are optional
    }],

// Like field as an array of strings
    likes: {
      type: [String],
    },

    
// Dislike field as an array of strings
    dislikes: {
      type: [String],
    },

// Comments field as an array of comment objects
    comments: [{
      body: String,         // Comment body as a string

      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',        // Reference to the User model for comment author
      },

      comment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',     // Reference to the Comment model
      },
    }],
  }, {
    timestamps: true,         // Timestamps for createdAt and updatedAt
  }
);

// Create and export the Post model using the schemas
export const PostModel = mongoose.model('Post', PostSchema);
