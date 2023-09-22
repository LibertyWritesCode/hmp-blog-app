import express from 'express'; // Import express framework

import { protectRoute } from '../controllers/auth.controller'; // Import authentication middleware

import { CreatePostHandler, GetAllPostHandler, GetAPostHandler,
    UpdateAPostHandler, DeleteAPostHandler, CommentOnAPostHandler,
    UpdateACommentHandler, LikeAPostHandler, UnlikeAPostHandler,
    DislikeAPostHandler, RevertDislikeAPostHandler} from '../controllers/blog'; // Import route handlers

// Create an express router instance
const router = express.Router();

// Create a post
router.post('/:userId', protectRoute, CreatePostHandler);

// Get all posts
router.get('/', GetAllPostHandler);

// Get a post
router.get('/:postId', GetAPostHandler);

// Edit/Update a particular post
router.put('/:postId', protectRoute, UpdateAPostHandler);

// Delete a post
router.delete('/:postId', protectRoute, DeleteAPostHandler);

// Comment on a post
router.post('/:postId/comment', protectRoute, CommentOnAPostHandler);

// Edit a comment
router.put('/:postId/comment/:commentId', protectRoute, UpdateACommentHandler);

// Like a post
router.post('/:postId/like', protectRoute, LikeAPostHandler);

// Unlike a post
router.post('/:postId/unlike', protectRoute, UnlikeAPostHandler);

// Dislike a post
router.post('/:postId/dislike', protectRoute, DislikeAPostHandler);

// Revert-dislike on a post
router.post('/:postId/revert-dislike', protectRoute, RevertDislikeAPostHandler);

// Export the router for use in the app.ts file
export default router;
