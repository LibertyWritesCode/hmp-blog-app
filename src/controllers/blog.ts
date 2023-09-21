import express from 'express';
import validator from 'validator';
import * as postService from '../services/blog'


  
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
        
    const data = await postService.signUp({ name, email, password });
    return res.status(200).send({ message: 'Signup successful', data });
        
   } catch (e: any) {
    if (e.message === 'Name already in use') {
      return res.status(400).send({ message: 'Name already in use' });
    }
    if (e.message === 'Email already in use') {
      return res.status(400).send({ message: 'Email already in use' });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
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
        const token = await postService.login({ email, password })

      return res.status(200).send({ message: 'Login sucessful', token });
         
        } catch (e: any) {
          if (e.message === 'Incorrect email or password') {
            return res.status(400).send({ message: 'Incorrect email or password' });
          }
          return res.status(500).send({ message: 'Internal Server Error' });
        }
};


// CREATE A POST
export const CreatePostHandler = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    const { title, content, tags } = req.body;

    try {

      if (!title || !content) {
        return res.status(400).send({ message: 'Title and content are required' });
      }
      if (title.length < 15 || title.length > 50) {
        return res.status(400).send({ message: 'Title must be between 15 and 50 characters' });
      }
      if (tags.length > 3) {
        return res.status(400).send({ message: 'You can only add 3 tags' });
      }
  
      const createPost = await postService.createPost(userId, { title, content, author: userId, tags});

      return res.status(200).send({ message: 'Post created successfully',  data: createPost });
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };
  

// GET ALL POSTS

export const GetAllPostHandler = async (req: express.Request, res: express.Response) => {
  const { searchTerm, page, perPage, order } = req.query;
  
    try {
      const query = {
        searchTerm: searchTerm as string,
        page: page as unknown as number,
        perPage: perPage as unknown as number,
        order: order as 'asc' | 'desc',
      };

      const allPosts = await postService.getAllPosts(query);
      return res.status(200).send(allPosts);
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };


// GET A POST

export const GetAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
  
    try {
      const post = await postService.getAPost(postId);
      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }
      return res.status(200).send(post);
    } catch (error: any) {
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };


// UPDATE/EDIT A POST
export const UpdateAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    try {
      if (!title || !content) {
        return res.status(400).send({ message: 'No changes made'})
      }
      const post = await postService.updateAPost(postId, { title, content, tags });
  
      return res.status(200).json({ message: 'Post update Successful', updatedAt: new Date() });
    } catch (e: any) {
      if (e.message === 'NOT FOUND') {
        return res.status(404).send({ message: 'Post Not Found'})
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  };   

  // DELETE A POST
  export const DeleteAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    try {
        const post = await postService.deleteAPost(postId);
        return res.status(200).send({ message: 'Post Deleted'})

    } catch (e: any) {
      if (e.message === 'NOT FOUND') {
        return res.status(404).send({ message: 'Post not found'})
      }
      return res.status(500).send({ message: 'Internal Server Error' })
    }   
};

// ADD COMMENT TO A POST OR COMMENT ON A POST
export const CommentOnAPostHandler = async (req: express.Request, res: express.Response) => {
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    if (!comment) {
      return res.status(400).send({ message: 'Add Comment' })
    }
      const post = await postService.commentOnAPost(postId, { comment });
      return res.status(200).send({ message: 'Comment Added', data: post});

    } catch (e: any) {
      if (e.message === 'POST NOT FOUND!') {
        return res.status(404).send({ message: 'Post not found' })
      }
      console.log(e)
      return res.status(500).send({ message: 'Internal Server Error' });
  }
};


//UPDATE/EDIT A COMMENT
export const UpdateACommentHandler = async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;
    const { comment } = req.body;

    try {
      if (!comment) {
        return res.status(400).send({ message: 'Update Comment'})
    }
        const post = await postService.updateAComment(postId, commentId, { comment })

        return res.status(200).send({ message: 'Comment Updated', updatedAt: new Date()})

    } catch (e: any) {
      if (e.message === 'Not Found') {
        return res.status(404).send({ message: 'Post and comment not found!'})
      }
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};


// LIKE A POST
export const LikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await postService.likeAPost(postId);
          return res.status(200).send({ message: 'Post liked' });
      
        } catch (e: any) {
          if (e.message === 'Post not found') {
            return res.status(404).send({ message: 'Post not found!'})
          }
          if (e.message === 'Post has already been liked') {
            return res.status(400).send({ message: 'Post has already been liked'})
          }
          return res.status(500).send({ message: 'Internal Server Error' });
        }
    };
      

// UNLIKE A POST
export const UnlikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await postService.unlikeAPost(postId);

        return res.status(200).send({ message: 'Post Unliked'})
 
      } catch (e: any) {
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// DISLIKE A POST
export const DislikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;
    
    try {
        const post = await postService.dislikeAPost(postId);
        return res.status(200).send({ message: 'Post Disliked'})
 
      } catch (e: any) {
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }
        if (e.message === 'Post has already been disliked') {
          return res.status(400).send({ message: 'Post has already been disliked'})
        }
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};

// REVERT A DISLIKE ON A POST
export const RevertDislikeAPostHandler = async (req: express.Request, res: express.Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.revertDislikeAPost(postId);
        if (!post) {
          return res.status(404).send({ message: 'Post not found' });
        }
        if (post) {
            post.dislikes -=1;
            post.dislikes = 0;
        }
        
        await post.save();
        return res.status(200).send({ message: 'Reverted Dislike'})
 
      } catch (e: any) {
        if (e.message === 'Post not found') {
          return res.status(404).send({ message: 'Post not found!'})
        }
        return res.status(500).send({ message: 'Internal Server Error'})
    }
};
