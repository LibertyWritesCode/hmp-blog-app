import mongoose from "mongoose"; // Import Mongoose package for MongoDB
import validator from "validator"; // Import validator package for email validation

// Create a schema object using Mongoose's Schema class
const Schema = mongoose.Schema;

// Define the schema for the 'User' model
const userSchema = new Schema({

// Field for user's name
    name: {
        type: String,      
        required: true     // Name is required
    },

// Field for user's email
    email: {
        type: String,    
        required: true,    // Email is required
        lowercase: true,   // Convert email to lowercase
        validate: validator.isEmail,       // Use validator package to validate email format
        unique: true       // Ensure email is unique
    },

// Field for user's password
    password: {
        type: String,      
        required: true,    // Password is required
        minlength: 8,      // Minimum password length of 8 characters
        select: false       // Do not include password in query results by default
    },

// Field for registration date
    registeredAt: {
        type: Date,        
        default: new Date() // Set default value to the current date
    },
});

// Create and export the User model using the schema
export const UserModel = mongoose.model('User', userSchema);
