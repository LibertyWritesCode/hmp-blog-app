
import dotenv from 'dotenv';
dotenv.config()


import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PostModel } from './src/models/blog';
import { UserModel } from './src/models/usermodel';
import { CommentModel } from './src/models/commentmodel';
import { CreatePostRequestBody, GetAPostRequestBody, EditPostRequestBody } from './src/interfaces/blog.types';

const app = express();
app.use(bodyParser.json());

app.get('/', (req: express.Request, res: express.Response) => {
    return res.status(200).send('Getting Started');
});

//SIGN UP
app.post('/signup', async (req: express.Request, res: express.Response, next) => {

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
});

//LOGIN
app.post('/login', async (req: express.Request, res: express.Response) =>  {
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
});


// CREATE A POST
app.post('/post', async (req: express.Request, res: express.Response) => {
    const { title, content, author } = req.body;
    try {
      if (!title || !author || !content) {
        return res.status(400).send({ message: 'Title, author, and content are required' });
      }
      if (title.length < 15 || title.length > 50) {
        return res.status(400).send({ message: 'Title must be between 15 and 50 characters' });
      }
  
      const createPost = await PostModel.create(req.body);

      return res.status(200).send({ message: 'Post created successfully', createdAt: new Date(), createPost });
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  

// GET ALL POSTS

app.get('/post', async (req: express.Request, res: express.Response) => {

        /*
        I'll come back to pagination for get all post
        const { perPage, order } = req.query;
        const perPageNum = perPage? perPage as unknown as number : 2;
        const orderVal = order? order as 'asc' | 'desc' : 'asc';

        */
  
    try {
      const allPosts = await PostModel.find();
      return res.status(200).send(allPosts);
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });


// GET A POST

app.get('/post/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
  
    try {
      const post = await PostModel.findById(id);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      return res.status(200).send(post);
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });


// EDIT A POST
app.put('/post/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    try {
      const post = await PostModel.findById(id);
  
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
  
      if (title) {
        post.title = title;
      }
      if (content) {
        post.content = content;
      }
  
      await post.save();
  
      return res.status(200).json({ message: 'Post update Successful', id: post._id, updatedAt: new Date() });
    } catch (error: any) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  });   

  // DELETE A POST
app.delete('/post/:id', async (req: express.Request, res: express.Response)=> {
    const { id } = req.params;
    try {
        const post = await PostModel.findById(id);
         if (!post) {
            throw new Error('NOT_FOUND');
         }
         // then delete
        await post.deleteOne();
        return res.status(200).send({ message: 'Post Deleted'})

    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }   
});

// ADD COMMENT TO A POST OR COMMENT ON A POST
app.post('/post/:id/comment', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    // Generate a unique comment ID
    const  commentId  = new mongoose.Types.ObjectId();

      const post = await PostModel.findById(id);

      if (!post) {
          return res.status(404).send({ message: 'POST NOT FOUND' });
      }

      if (post) {
         // Push the new comment to the post's comments array
      post.comments.push({ _id: commentId, body: comment }); 
      }

      // Create a new comment object
     const newComment = new CommentModel({ _id: commentId, body: comment })
     


      // Save the post and the new comment sequentially
      await post.save();
     await newComment.save();

      return res.status(200).send({ message: 'Comment Added', data: comment });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
  }
});


//UPDATE/EDIT A COMMENT
app.put('/post/:id/comment/:commentId', async (req: express.Request, res: express.Response) => {
    const { id, commentId } = req.params;
    const { comment } = req.body;

    try {
        const post = await PostModel.findOneAndUpdate(
            { _id: id, 'comments._id': commentId },
            { $set: { 'comments.$.body': comment } },
            { new: true }
        );  

        if (!post) {
            throw new Error('Post and comment not found!');
        }
        
        await post.save();
        return res.status(200).send({ message: 'Comment Updated', updatedAt: new Date() })

    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});


// LIKE A POST
app.post('/post/:id/like', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    
    try {
        const post = await PostModel.findById(id);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post.dislikes === 1) {
            post.dislikes -=1;
            post.likes +=1

        } else if (post.dislikes === 0) {
            post.likes +=1

        } else {
            post.likes = 1;
            post.dislikes = 0;
        }
        await post.save();
        return res.status(200).send({ message: 'Post liked'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// UNLIKE A POST
app.post('/post/:id/unlike', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    
    try {
        const post = await PostModel.findById(id);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post) {
            post.likes -=1;
            post.likes = 0;
        }
        
        // You have to like a post for it to be unliked
        if (post.likes === 0) {
            throw new Error('Action cannot take place')
        }
        await post.save();
        return res.status(200).send({ message: 'Post Unliked'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// DISLIKE A POST
app.post('/post/:id/dislike', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    
    try {
        const post = await PostModel.findById(id);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post.likes === 1) {
            post.likes -=1;
            post.dislikes +=1

        } else if (post.likes === 0) {
            post.dislikes +=1

        } else {
            post.dislikes = 1;
            post.likes = 0;
        }

        await post.save();
        return res.status(200).send({ message: 'Post Disliked'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// REVERT A DISLIKE ON A POST
app.post('/post/:id/revert-dislike', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    try {
        const post = await PostModel.findById(id);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post) {
            post.dislikes -=1;
            post.dislikes = 0;
        }
        // You have to dislike a post for it to revert-dislike
        if (post.dislikes === 0) {
            throw new Error('Action cannot take place')
        }
        await post.save();
        return res.status(200).send({ message: 'Reverted Dislike'})
 
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});
      
app.listen(4000, async () => {
    console.log('Server is running oo')
    //const conn = await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connect('mongodb://127.0.0.1/hmp-blog-app');
      
    //await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB')
});

export {}





/*
 // DELETE A COMMENT
  app.delete('/post/:postId/comment/:commentId', async (req: express.Request, res: express.Response)=> {
    const { postId, commentId } = req.params;
    try {


        const delComment = await CommentModel.findByIdAndDelete(commentId);

        if (!delComment) {
            throw new Error('NOT_FOUND');
        }

        // Remove the comment reference from the PostModel
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('POST_NOT_FOUND');
        }

        // Remove the comment from the post's comments array
        post.comments.pull(commentId);
        await post.save();
        return res.status(200).send({ message: 'Comment Deleted'})

    } catch (error) {
      console.log(error)
        return res.status(500).send({ message: 'Internal Server Error' })
    }   
});

// REPLY A COMMENT
app.post('/comment/:commentId/reply', async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;
    const { reply } = req.body;

    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            throw new Error('Comment not found!')
        }

        const replyComment = new CommentModel({ reply })

        await replyComment.save()

        comment.replies.push(reply)

        await comment.save()
      
        return res.status(200).send({ message: 'Reply Added'})
    } catch (error) {
      console.log(error)
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});



// LIKE A COMMENT
app.post('/comment/:commentId/like', async (req: express.Request, res: express.Response) => {
    const { commentId } = req.params;

    try {
        // Find post by its ID
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
          }
          if (comment.dislikes === 1) {
            comment.dislikes -=1;
            comment.likes +=1
  
          } else if (comment.dislikes === 0) {
            comment.likes +=1
  
          } else {
            comment.likes = 1;
            comment.dislikes = 0;
          }
          await comment.save();
   
        return res.status(200).send({ message: 'Comment Liked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// UNLIKE A COMMENT
app.post('/comment/:commentId/unlike', async (req: express.Request, res: express.Response) => {
    const { commentId } = req.params;

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
          }
        if (comment) {
        // Decrease the likes count of the comment
        comment.likes -= 1;
        }
      
        await comment.save()
        return res.status(200).send({ message: 'Comment Uniked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});


// DISLIKE A COMMENT
app.post('/comment/:commentId/dislike', async (req: express.Request, res: express.Response) => {
    const { postId, commentId  } = req.params;

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
          }
          if (comment.likes === 1) {
            comment.likes -=1;
            comment.dislikes +=1
  
          } else if (comment.likes === 0) {
            comment.dislikes +=1
  
          } else {
            comment.dislikes = 1;
            comment.likes = 0;
          }
          await comment.save();
        return res.status(200).send({ message: 'Comment Disliked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});


// REVERT-DISLIKE ON A COMMENT
app.post('/post/:postId/comment/:commentId/dislike', async (req: express.Request, res: express.Response) => {
    const { postId, commentId  } = req.params;
    const { like } = req.body;

    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new Error('Post not found!')
        }
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment) {
        // Decrease the dislikes count of the comment
        comment.dislikes -= 1;
        }

        await post.save()
        return res.status(200).send({ message: 'Comment Disliked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});



*/