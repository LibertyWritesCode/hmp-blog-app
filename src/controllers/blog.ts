import express from 'express';      // Import express framework
import validator from 'validator';  // Import validator package for email validation
import * as postService from '../services/blog'; // Import all service functions

// SIGNUP HANDLER
export const SignUpHandler = async (req: express.Request, res: express.Response) => {
    try {
      // Receive request body data 
        const { name, email, password } = req.body;
        
      // 1. Check if the user submitted the required values
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Name, email, and password are required' });
        } 

      // 2. Check if the email address is valid
        if (!validator.isEmail(email)) {
            return res.status(400).send({ message: 'Enter a valid email address' });
        }

      // 3. Check if the password length is at least 8 characters
        if (password.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters' });
        }
        
      // Call the signUp function from the imported postService 
        const data = await postService.signUp({ name, email, password });
        
      // Respond with a success message and the returned data
        return res.status(200).send({ message: 'Signup successful', data });
        
   } catch (e: any) {
        // Handle different error cases
        if (e.message === 'Name already in use') {
            return res.status(400).send({ message: 'Name already in use' });
        }
        if (e.message === 'Email already in use') {
            return res.status(400).send({ message: 'Email already in use' });
        }
        // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};


//LOGIN HANDLER
export const LoginHandler = async (req: express.Request, res: express.Response) => {
   // Receive request body data 
  const { email, password } = req.body;

  try {
    // 1. Check if the user submitted the required values
      if (!email || !password) {
          return res.status(400).send({ message: 'Email and password are required' });
      }
      
    // 2. Check if user exists and password is correct by calling the login function in postService
      const token = await postService.login({ email, password });
      
    // If login is successful, respond with a success message and the JWT token
      return res.status(200).send({ message: 'Login successful', token });
       
  } catch (e: any) {
      // Handle error case
      if (e.message === 'Incorrect email or password') {
          return res.status(400).send({ message: 'Incorrect email or password' });
      }
       // Handle any unexpected errors with a 500 status code response
      return res.status(500).send({ message: 'Internal Server Error' });
  }
};


// CREATE A POST HANDLER
export const CreatePostHandler = async (req: express.Request, res: express.Response) => {
      // Receive request body data and request parameters
      const { userId } = req.params;
      const { title, content, tags } = req.body;
  
      try {
          // 1. Check if the user submitted the required values
          if (!title || !content) {
              return res.status(400).send({ message: 'Title and content are required' });
          }
  
          // 2. Check if the title length is between 15 and 50 characters
          if (title.length < 15 || title.length > 50) {
              return res.status(400).send({ message: 'Title must be between 15 and 50 characters' });
          }
  
          // 3. Check that the number of tags is not greater than 3
          if (tags.length > 3) {
              return res.status(400).send({ message: 'You can only add 3 tags' });
          }
    
          // Call the createPost function from the imported postService
          const createPost = await postService.createPost(userId, { title, content, author: userId, tags });
          // Respond with a success message and the created post data
          return res.status(200).send({ message: 'Post created successfully',  data: createPost });

      } catch (error) {
          // Handle any unexpected errors with a 500 status code response
          return res.status(500).send({ message: 'Internal Server Error' });
      }
  };
  
  

// GET ALL POSTS HANDLER
export const GetAllPostHandler = async (req: express.Request, res: express.Response) => {
    // Receive query parameters from the request
    const { searchTerm, page, perPage, order } = req.query;
    
    try {
        // Define a query object to pass to the postService
        const query = {
            searchTerm: searchTerm as string,
            page: page as unknown as number,
            perPage: perPage as unknown as number,
            order: order as 'asc' | 'desc',
        };

        // Call the getAllPosts function from the postService
        const allPosts = await postService.getAllPosts(query);
        // Respond with a status 200 and the fetched allPosts
        return res.status(200).send(allPosts);

    } catch (error) {
       // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};


// GET A POST HANDLER
export const GetAPostHandler = async (req: express.Request, res: express.Response) => {
      // Receive postId from the request parameter
      const { postId } = req.params;
    
      try {
          // 1. Call the getAPost function from the postService
          const post = await postService.getAPost(postId);
  
          //2.  Check if the post exists
          if (!post) {
          // If the post does not exist, respond with a status 404 and an error message
              return res.status(404).send({ message: 'Post not found' });
          }
          // If the post exists, respond with a status 200 and the fetched post
          return res.status(200).send(post);

      } catch (error: any) {
        // Handle any unexpected errors with a 500 status code response
          return res.status(500).send({ message: 'Internal Server Error' });
      }
  };
  


// UPDATE/EDIT A POST HANDLER
export const UpdateAPostHandler = async (req: express.Request, res: express.Response) => {
      // Receive request body data and request parameters
      const { postId } = req.params;
      const { title, content, tags } = req.body;
    
      try {
          // 1. If title and content are not provided in the request, then the user has not made any changes
          if (!title || !content) {
              return res.status(400).send({ message: 'No changes made' });
          }
          
          //2. Call the updateAPost function from the postService
          const post = await postService.updateAPost(postId, { title, content, tags });
          // Respond with a status 200 and a success message as well as the updated timestamp
          return res.status(200).json({ message: 'Post update Successful', updatedAt: new Date() });

      } catch (e: any) {
          // Handle different error cases
          if (e.message === 'NOT FOUND') {
              return res.status(404).send({ message: 'Post Not Found' });
          }

         // Handle any unexpected errors with a 500 status code response
          return res.status(500).send({ message: 'Internal Server Error' });
      }
  };
   

// DELETE A POST HANDLER
export const DeleteAPostHandler = async (req: express.Request, res: express.Response) => {
  // Receive postId from the request parameter
    const { postId } = req.params;

    try {
        // Call the deleteAPost function from the postService 
        const post = await postService.deleteAPost(postId);
        // Respond with a status 200 and a success message indicating that the post was deleted
        return res.status(200).send({ message: 'Post Deleted' });

    } catch (e: any) {
        // Handle different error cases
        if (e.message === 'NOT FOUND') {
            return res.status(404).send({ message: 'Post not found' });
        }

         // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error' });
    }   
};


// ADD COMMENT TO A POST/ COMMENT ON A POST HANDLER
export const CommentOnAPostHandler = async (req: express.Request, res: express.Response) => {
   // Receive request body data and request parameters
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    // Check if user added a comment
    if (!comment) {
      return res.status(400).send({ message: 'Add Comment' })
    }
     // Call the commentOnAPost function from the postService 
      const post = await postService.commentOnAPost(postId, { comment });
         // Respond with a status 200 and a success message indicating that the comment was added
      return res.status(200).send({ message: 'Comment Added', data: post});

    } catch (e: any) {
       // Handle different error cases
      if (e.message === 'POST NOT FOUND!') {
        return res.status(404).send({ message: 'Post not found' })
      }

       // Handle any unexpected errors with a 500 status code response
      return res.status(500).send({ message: 'Internal Server Error' });
  }
};


//UPDATE/EDIT A COMMENT HANDLER
export const UpdateACommentHandler = async (req: express.Request, res: express.Response) => {
  // Receive request body data and request parameters
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    try {
      // Check if user updated/edited the comment 
      if (!comment) {
        return res.status(400).send({ message: 'Update Comment'})
    }
        // Call the updateAComment function from the postService 
        const post = await postService.updateAComment(postId, commentId, { comment })
         // Respond with a status 200 and a success message indicating that the comment was updated 
        return res.status(200).send({ message: 'Comment Updated', updatedAt: new Date()})

    } catch (e: any) {
       // Handle different error cases
      if (e.message === 'Not Found') {
        return res.status(404).send({ message: 'Post and comment not found!'})
      }

       // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};


// LIKE A POST HANDLER
export const LikeAPostHandler = async (req: express.Request, res: express.Response) => {
   // Receive request body data and request parameters
    const { postId } = req.params;
    const { name } = req.body;
    
    try {
           // Call the likeAPost function from the postService 
        const post = await postService.likeAPost(postId, { name });
        // Respond with a status 200 and a success message indicating that the post was liked
          return res.status(200).send({ message: 'Post liked' });
      
        } catch (e: any) {
           // Handle different error cases
          if (e.message === 'Post not found') {
            return res.status(404).send({ message: 'Post not found!'})
          }
          if (e.message === 'User has already liked the post') {
            return res.status(400).send({ message: 'User has already liked the post'})
          }

           // Handle any unexpected errors with a 500 status code response
          return res.status(500).send({ message: 'Internal Server Error' });
        }
    };
      

// UNLIKE A POST HANDLER
export const UnlikeAPostHandler = async (req: express.Request, res: express.Response) => {
  // Receive request body data and request parameters
  const { name } = req.body;
  const { postId } = req.params;
    
    try {
        // Call the unlikeAPost function from the postService 
        const post = await postService.unlikeAPost(postId, { name });
        // Respond with a status 200 and a success message indicating that the post was unliked
        return res.status(200).send({ message: 'Post Unliked'})
 
      } catch (e: any) {
        // Handle different error cases
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }

         // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// DISLIKE A POST HANDLER
export const DislikeAPostHandler = async (req: express.Request, res: express.Response) => {
  // Receive request body data and request parameters
  const { name } = req.body;
  const { postId } = req.params;
    
    try {
       // Call the dislikeAPost function from the postService 
        const post = await postService.dislikeAPost(postId, { name });
        // Respond with a status 200 and a success message indicating that the post was disliked
        return res.status(200).send({ message: 'Post Disliked'})
 
      } catch (e: any) {
        // Handle different error cases
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }
        if (e.message === 'User has already disliked the post') {
          return res.status(400).send({ message: 'User has already disliked the post'})
        }

        // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// REVERT A DISLIKE ON A POST HANDLER
export const RevertDislikeAPostHandler = async (req: express.Request, res: express.Response) => {
  // Receive request body data and request parameters
  const { name } = req.body
  const { postId } = req.params;

    try {
        // Call the dislikeAPost function from the postService 
        const post = await postService.revertDislikeAPost(postId, { name });
         // Respond with a status 200 and a success message indicating that the post dislike was reverted
        return res.status(200).send({ message: 'Reverted Dislike'})
 
      } catch (e: any) {
        // Handle different error cases
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }
        
         // Handle any unexpected errors with a 500 status code response
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};
