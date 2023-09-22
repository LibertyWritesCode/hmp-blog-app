import dotenv from 'dotenv';   // Load environment variables from a .env file
dotenv.config();

import express from 'express';    // Import express framework
import bodyParser from 'body-parser'; // Import middleware to parse JSON data
import mongoose from 'mongoose';  // Import mongoose package for MongoDB
import signupRouter from './src/routes/signup';  // Import signup route handler
import loginRouter from './src/routes/login';    // Import login route handler
import postRouter from './src/routes/blog';      // Import blog post route handler

// Create an Express application instance
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the signup route handler for '/signup' routes
app.use(signupRouter);

// Use the login route handler for '/login' routes
app.use(loginRouter);

// Use the blog post route handler for '/post' routes
app.use('/post', postRouter);


// Start the Express server on port 4000
app.listen(4000, async () => {
    console.log('Server is running oo');

// Connect to the MongoDB database
    await mongoose.connect('mongodb://127.0.0.1/hmp-blog-app');
    console.log('Connected to MongoDB');
});

// Export an empty object
export {};

