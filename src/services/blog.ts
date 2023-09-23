import dotenv from 'dotenv';
dotenv.config()

import { PostModel } from '../models/blog';
import { UserModel } from '../models/usermodel';
import { CommentModel } from '../models/commentmodel';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {SignUpRequestBody, LoginRequestBody, CreatePostRequestBody, 
  GetAllPostRequest, UpdatePostRequestBody, CommentOnPostRequestBody, LikeRequestBody} from '../interfaces/blog.types';

//SIGN UP
export const signUp = async function (body: SignUpRequestBody): Promise<any> {
      // Receive request body data
        const { name, email, password} = body;

      //1. Check if the name already exists in the database
    const existingName = await UserModel.findOne({ name });
        if (existingName) {
      // If name is already in use, throw an error
          throw new Error('Name already in use');
        }

      //2. Check if the email already exists in the database
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      // If email is already in use, throw an error
        throw new Error('Email already in use');
    }

    //3. Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    //4. Save the user to the database 
    const newUser = await UserModel.create({ 
      name: body.name, 
      email: body.email, 
      password: hashedPassword });

    //5. Generate a unique token for the user (JWT token)
    const token = jwt.sign(
        // Payload to be included in the token
        { userId: newUser._id },
        // JWT secret key
        process.env.JWT_SECRET as string,
        // Token expiration time
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // Return generated token
    return token;
        
};


// LOGIN
export const login = async function (body: LoginRequestBody): Promise<any> {
   // Receive request body data
    const { email, password } = body;

    // 1. Check if user exists and pwd is correct based on the provided request body
    const user = await UserModel.findOne({ email: email }).select('+password');

    // 2. Compare the provided password with the hashed password stored in the database
    if (!user || !(await bcrypt.compare(password, user.password))) {
        // If the user doesn't exist or the password is incorrect, throw an error
        throw new Error('Incorrect email or password');
    }

    // 3. If everything is okay, generate a JWT token
  const token =  jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

    // Return the generated token
    return token;
};

  
// CREATE A POST
export const createPost = async function (userId: string, body: CreatePostRequestBody): Promise<any> {
  // Receive request body data
    const { title, content, tags } = body;
     // Use PostModel.create() to create a new post document and return the newly created post
    return await PostModel.create({ title, content, author: userId, tags});
  };


// GET ALL POSTS 
export const getAllPosts = async function (request: GetAllPostRequest): Promise<any> {
  // Receive request parameters
  const { searchTerm, page, perPage, order } = request;
  // Use PostModel to find all posts
  const posts = await PostModel.find();
  // Return the array of found posts
  return posts;
};


  // GET A POST
export const getAPost = async function (postId: string): Promise<any> {
  // Use PostModel to find the post by its ID
  const post = await PostModel.findById(postId);
  // Return the found post 
  return post;
};


// UPDATE/EDIT A POST
export const updateAPost = async function (postId: string, body: UpdatePostRequestBody): Promise<any> {
  // Receive request body data
  const { title, content, tags } = body;

  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
      // If the post is not found, throw an error
      throw new Error('NOT FOUND');
  }

  // Check if title property is provided and update it 
  if (title) {
      post.title = title;
  }

  // Check if content property is provided and update it 
  if (content) {
      post.content = content;
  }

  // Save the updated post
  await post.save();

  // Return the updated post
  return post;
};
 

  // DELETE A POST
  export const deleteAPost = async function (postId: string): Promise<void> {
  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
    // If the post is not found, throw an error 
      throw new Error('NOT FOUND');
  }

  // Delete the post
  await post.deleteOne();

};


// ADD COMMENT TO A POST OR COMMENT ON A POST
export const commentOnAPost = async function (postId: string, body: CommentOnPostRequestBody): Promise<any> {
  // Receive request body data
  const { comment } = body;

  // Generate a unique comment ID using mongoose
  const commentId = new mongoose.Types.ObjectId();

  // Find the post by its postId
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
  // If the post is not found, throw an error
      throw new Error('POST NOT FOUND!');
  }

  // If the post exists, push the new comment to the post's comments array
  post.comments.push({ _id: commentId, body: comment });

  // Create a new comment object using CommentModel
  const newComment = new CommentModel({ _id: commentId, body: comment });

  // Save the post and the new comment 
  await post.save();
  await newComment.save();

  // Return the updated post
  return post;
};



//UPDATE/EDIT A COMMENT
export const updateAComment = async function (postId: string, commentId: string, body: CommentOnPostRequestBody): Promise<any> {
 // Receive request body data
  const { comment } = body;

  // Find the post with the specified postId and comment with commentId
  const post = await PostModel.findOneAndUpdate(
      // Query to find the post and the specific comment within it
      { _id: postId, 'comments._id': commentId },
      // Update the body of the specific comment
      { $set: { 'comments.$.body': comment } },
      // Option to return the updated document
      { new: true }
  );

  // Check if the post exists
  if (!post) {
  // If the post is not found, throw an error
      throw new Error('Not Found');
  }

  // Save the updated post
  await post.save();

  // Return the updated post
  return post;
};



// LIKE A POST 
export const likeAPost = async function (postId: string, body: LikeRequestBody): Promise<any> {
  // Receive request body data
  const { name } = body;
  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
      // If the post is not found, throw an error
      throw new Error('Post not found');
  }

  // Check if user has already liked the post
  if (post.likes.includes(name)) {
    throw new Error('User has already liked the post');
  }
  // Check if user has already disliked the post and remove the user from the dislikes array
  if (post.dislikes.includes(name)) {
    post.dislikes.splice(post.dislikes.indexOf(name, 1))
  }

  // Add name to the likes array
  post.likes.push(name)
  // Save the post with the updated like and dislike counts
  await post.save();

  // Return the updated post
  return post;
};

      
// UNLIKE A POST
export const unlikeAPost = async function (postId: string, body: LikeRequestBody): Promise<any> {
  // Receive request body data
  const { name } = body;
  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
      // If the post is not found, throw an error
      throw new Error('Post not found');
  }

  // Remove the user from the likes array
    post.likes.splice(post.likes.indexOf(name, 1))

    // Save the unliked post
  await post.save();
  // Return the updated post
  return post;
};


// DISLIKE A POST
export const dislikeAPost = async function (postId: string, body: LikeRequestBody): Promise<any> {
  // Receive request body data
  const { name } = body;
  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
      // If the post is not found, throw an error
      throw new Error('Post not found');
  }
// Check if user has already disliked the post
  if (post.dislikes.includes(name)) {
    throw new Error('User has already disliked the post');
  }
  // Check if user has already liked the post and remove the user from the likes array
  if (post.likes.includes(name)) {
    post.likes.splice(post.likes.indexOf(name, 1))
  }

  // Add name to the dislikes array
  post.dislikes.push(name)
  // Save the post with the updated like and dislike counts
  await post.save();

  // Return the updated post
  return post;
};


// REVERT A DISLIKE ON A POST
export const revertDislikeAPost = async function (postId: string, body: LikeRequestBody): Promise<any> {
  // Receive request body data
  const { name } = body;
  // Find the post by its ID using PostModel
  const post = await PostModel.findById(postId);

  // Check if the post exists
  if (!post) {
      // If the post is not found, throw an error
      throw new Error('Post not found');
  }

  // Remove the user from the dislikes array
   post.dislikes.splice(post.dislikes.indexOf(name, 1))
  
  // Save the post with the updated 'dislikes' count
  await post.save();

  // Return the updated post
  return post;
};

