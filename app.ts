import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { PostModel } from './src/models/blog';
import { CommentModel } from './src/models/commentmodel';
import { CreatePostRequestBody, GetAPostRequestBody, EditPostRequestBody } from './src/interfaces/blog.types';

const app = express();
app.use(bodyParser.json());

app.get('/', (req: express.Request, res: express.Response) => {
    return res.status(200).send('Getting Started');
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
  
      const createPost = await PostModel.create({
        title,
        content,
        author,
      });

      return res.status(200).send({ message: 'Post created successfully', createdAt: new Date() });
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
  
      return res.status(200).json({ message: 'Update Successful', id: post._id, updatedAt: new Date() });
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
        const post = await PostModel.findById(id);

        if (!post) {
            throw new Error('POST NOT FOUND!')
        }
        //Adding new comments to the comment array of the PostModel. 
        //Each comment is an object with a body that holds the comment texts(strings).
        if (post) {
            post.comments.push({ body: comment });
        }
        await post.save()
        return res.status(200).send({ message: 'Comment Added'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// LIKE A COMMENT
app.post('/post/:postId/comment/:commentId/like', async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;

    try {
        // Find post by its ID
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new Error('POST NOT FOUND!')
        }
    
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found!' });
        }
        if (comment) {
        // Increment the likes count of the comment
        comment.likes += 1;
        }
        
        await post.save()
        return res.status(200).send({ message: 'Comment Liked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});

// UNLIKE A COMMENT
app.post('/post/:postId/comment/:commentId/unlike', async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;

    try {
        const post = await PostModel.findById(postId);

        if (!post) {
            throw new Error('POST NOT FOUND!')
        }
         const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment) {
        // Decrease the likes count of the comment
        comment.likes -= 1;
        }
      
        await post.save()
        return res.status(200).send({ message: 'Comment Uniked'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
    }
});


// DISLIKE A COMMENT
app.post('/post/:postId/comment/:commentId/dislike', async (req: express.Request, res: express.Response) => {
    const { postId, commentId  } = req.params;

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
        // Increment the dislikes count of the comment
        comment.dislikes += 1;
        }

        await post.save()
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




// REPLY A COMMENT
app.post('/post/:postId/comment/:commentId/reply', async (req: express.Request, res: express.Response) => {
    const { postId, commentId } = req.params;
    const { reply } = req.body;

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
        comment.comments.push(reply);
        }
        
        await comment.save()
        return res.status(200).send({ message: 'Reply Added'})
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error'})
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





*/