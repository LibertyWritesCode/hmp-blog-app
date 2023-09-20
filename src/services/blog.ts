import { PostModel } from '../models/blog';
import { UserModel } from '../models/usermodel';
import { CommentModel } from '../models/commentmodel';
import mongoose from 'mongoose';
import { CreatePostRequestBody, UpdatePostRequestBody, CommentOnPostRequestBody } from '../interfaces/blog.types';

  
// CREATE A POST
export const createPost = async function (body: CreatePostRequestBody): Promise<any> {
    const { title, content, author, tags } = body;
    return await PostModel.create({ title, content, author, tags});
  };

// GET ALL POSTS
  export const getAllPosts = async function (): Promise<any> {
    return await PostModel.find();
  }


  // GET A POST
export const getAPost = async function (postId: string): Promise<any> {
    return await PostModel.findById(postId);
}

// UPDATE/EDIT A POST
export const updateAPost = async function (postId: string, body: UpdatePostRequestBody): Promise<any> {
    const { title, content, tags } = body;
  
      const post = await PostModel.findById(postId);
  
      if (!post) {
        throw new Error('NOT_FOUND');
      }
  
      if (title) {
        post.title = title;
      }
      if (content) {
        post.content = content;
      }
  
      await post.save();
      return post;
  };   

  // DELETE A POST
  export const deleteAPost = async function (postId: string): Promise<any> {
        const post = await PostModel.findById(postId);
         if (!post) {
            throw new Error('NOT_FOUND');
         }
         // then delete
        await post.deleteOne();
        return post
    };

// ADD COMMENT TO A POST OR COMMENT ON A POST
export const commentOnAPost = async function (postId: string, body: CommentOnPostRequestBody): Promise<any> {
  const { comment } = body;

    // Generate a unique comment ID
    const commentId = new mongoose.Types.ObjectId();

      const post = await PostModel.findById(postId);

      if (!post) {
          throw new Error('POST NOT FOUND!')
      }
      if (!comment) {
        throw new Error('Add Comment')
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

      return post
};


//UPDATE/EDIT A COMMENT
export const updateAComment = async function (postId: string, commentId: string, body: CommentOnPostRequestBody): Promise<any> {
    const { comment } = body;

        const post = await PostModel.findOneAndUpdate(
            { _id: postId, 'comments._id': commentId },
            { $set: { 'comments.$.body': comment } },
            { new: true }
        );  

        if (!post) {
            throw new Error('Post and comment not found!');
        }
        if (!comment) {
            throw new Error('Update Comment' );
        }
        await post.save();
        return post;
};


// LIKE A POST
export const likeAPost = async function (postId: string): Promise<any> {
    
        const post = await PostModel.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        let userHasLiked = false;
        let userHasDisliked = false;

        if (post.likes === 1) {
        userHasLiked = true;
        }
        if (post.dislikes === 1) {
          userHasDisliked = true;
          }

          if (userHasLiked) {
            throw new Error('Post has already been liked');
          }
      
          // If the user has previously disliked the post, reduce dislike count to 0 and increase like count
          if (userHasDisliked) {
            // Reduce dislike count to 0
            post.dislikes = 0;
            // Increase like count by 1
            post.likes = 1;
          } else {
            // User hasn't liked or disliked the post, so increase the like count by 1
            post.likes = 1;
          }
          await post.save();
          return post
    };
      

// UNLIKE A POST
export const unlikeAPost = async function (postId: string): Promise<any> {
 
        const post = await PostModel.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        if (post) {
            post.likes = 0;
        }
        
        await post.save();
        return post;
};

// DISLIKE A POST
export const dislikeAPost = async function (postId: string): Promise<any> {
 
        const post = await PostModel.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        let userHasLiked = false;
        let userHasDisliked = false;

        if (post.likes === 1) {
        userHasLiked = true;
        }
        if (post.dislikes === 1) {
          userHasDisliked = true;
          }

          if (userHasDisliked) {
            throw new Error('Post has already been disliked');
          }
      
          // If the user has previously liked the post, reduce like count to 0 and increase dislike count
          if (userHasLiked) {
            // Reduce dislike count to 0
            post.likes = 0;
            // Increase like count by 1
            post.dislikes = 1;
          } else {
            // User hasn't disliked or liked the post, so increase the dislike count by 1
            post.dislikes = 1;
          }

        await post.save();
        return post;
};

// REVERT A DISLIKE ON A POST
export const revertDislikeAPost = async function (postId: string): Promise<any> {
        const post = await PostModel.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        if (post) {
            post.dislikes -=1;
            post.dislikes = 0;
        }
        
        await post.save();
        return post;
};