import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/usermodel';
import * as blogService from '../services/blog'


  
//SIGN UP
export const SignUpHandler = async (req: express.Request, res: express.Response) => {

    try {
       // Receive req.body
        const { name, email, password} = req.body;
        
        //1. Check if user submitted the required values
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Name, email, and password are required' });
        } 
        //2. Check if email address is valid
        if (!validator.isEmail(email)) {
          return res.status(400).send({ message: 'Enter valid email address'})
        }
        //3. Check if password length is not less than 8 characters
        if (password.length < 8) {
          return res.status(400).send({ message: 'Password must be at least 8 characters'})
        }
        //if (password !== passwordConfirm) {
          //return res.status(400).json({ error: 'Passwords do not match' });
        //}

         //4. Check if the name already exists in the database
    const existingName = await UserModel.findOne({ name });
    if (existingName) {
      return res.status(400).send({ message: 'Name already in use' });
    }

       //5. Check if the email already exists in the database
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ message: 'Email already in use' });
    }

    //6. Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    //7. Save the user to the database 
    const newUser = await UserModel.create({ 
      name: req.body.name, 
      email: req.body.email, 
      password: hashedPassword });

    //8. Generate a unique token for the user (JWT token)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.status(200).send({ message: 'Signup successful', token, data: { user: newUser} });
        
    } catch (error) {
      console.log(error)
        return res.status(500).send({ error: 'Internal Server Error'})
    }
};

//LOGIN
export const LoginHandler = async (req: express.Request, res: express.Response) => {
        const { email, password } = req.body;

        try {
           //1. Check if email and pwd exists
        if (!email || !password) {
          return res.status(400).send({ message: 'Email and password are required' });
        }
          
        //2. Check if user exists and pwd is correct
        const user = await UserModel.findOne({ email: email }).select('+password')
    
        // Compare the provided password with the hashed password stored in the database
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).send({ message: 'Incorrect email or password' });
        }
       
      //3. If everything is ok, send token back to client
      const token =  jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
      return res.status(200).send({ message: 'Login sucessful', token });
         
        } catch (error) {
          console.log(error)
          return res.status(500).send({ message: 'Internal Server Error' });
        }
};


// CREATE A POST
export const CreatePostHandler = async (req: express.Request, res: express.Response) => {
    const { title, content, author, tags } = req.body;
    try {
      if (!title || !author || !content) {
        return res.status(400).send({ message: 'Title, author, and content are required' });
      }
      if (title.length < 15 || title.length > 50) {
        return res.status(400).send({ message: 'Title must be between 15 and 50 characters' });
      }
      if (tags.length > 3) {
        return res.status(400).send({ message: 'You can only add 3 tags' });
      }
  
      const createPost = await blogService.createPost(req.body);

      return res.status(200).send({ message: 'Post created successfully',  data: createPost });
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };
  

// GET ALL POSTS

export const GetAllPostHandler = async (req: express.Request, res: express.Response) => {
  const { page = 1, perPage = 10, order = 'asc', title = 'blog' } = req.query;
  
    try {
      const allPosts = await blogService.getAllPosts();
      return res.status(200).send(allPosts);
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };


// GET A POST

export const GetAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
  
    try {
      const post = await blogService.getAPost(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      return res.status(200).send(post);
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };


// UPDATE/EDIT A POST
export const UpdateAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    try {
      const post = await blogService.updateAPost(postId, { title, content, tags });
  
      return res.status(200).json({ message: 'Post update Successful', updatedAt: new Date() });
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };   

  // DELETE A POST
  export const DeleteAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    try {
        const post = await blogService.deleteAPost(postId);
        return res.status(200).send({ message: 'Post Deleted'})

    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }   
};

// ADD COMMENT TO A POST OR COMMENT ON A POST
export const CommentOnAPostHandler = async (req: express.Request, res: express.Response) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    // Generate a unique comment ID
    const  commentId  = new mongoose.Types.ObjectId();

      const post = await blogService.commentOnAPost(postId, { comment });
      return res.status(200).send({ message: 'Comment Added', data: comment });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
  }
};


//UPDATE/EDIT A COMMENT
export const UpdateACommentHandler = async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    try {
        const post = await blogService.updateAComment(
            { _id: postId, 'comments._id': commentId },
            { $set: { 'comments.$.body': comment } },
            { new: true }
        );  

        return res.status(200).send({ message: 'Comment Updated', updatedAt: new Date() })

    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};


// LIKE A POST
export const LikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await blogService.likeAPost(postId);
          return res.status(200).send({ message: 'Post liked' });
      
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: 'Internal Server Error' });
        }
    };
      

// UNLIKE A POST
export const UnlikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await blogService.unlikeAPost(postId);

        return res.status(200).send({ message: 'Post Unliked'})
 
    } catch (error) {
      console.log(error)
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// DISLIKE A POST
export const DislikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await blogService.dislikeAPost(postId);
        return res.status(200).send({ message: 'Post Disliked'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// REVERT A DISLIKE ON A POST
export const RevertDislikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;

    try {
        const post = await blogService.revertDislikeAPost(postId);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post) {
            post.dislikes -=1;
            post.dislikes = 0;
        }
        
        await post.save();
        return res.status(200).send({ message: 'Reverted Dislike'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};
