
import dotenv from 'dotenv';
dotenv.config()


import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import signupRouter from './src/routes/signup'
import loginRouter from './src/routes/login'
import postRouter from './src/routes/blog'


const app = express();
app.use(bodyParser.json());


app.use(signupRouter);

app.use(loginRouter);

app.use('/post', postRouter);
      
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