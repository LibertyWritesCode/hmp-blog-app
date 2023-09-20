import express from 'express';
//import {
  //CreateTodoHandler,
  //DeleteTodoByIdHandler,
  //GetAllTodosHandler,
  //GetTodoByIdHandler,
  //UpdateTodoHandler
//} from '../controllers/todo.controller';
import { protectRoute } from '../controllers/auth.controller'
import { SignUpHandler, LoginHandler, CreatePostHandler, 
    GetAllPostHandler, GetAPostHandler, UpdateAPostHandler, 
    DeleteAPostHandler, CommentOnAPostHandler, UpdateACommentHandler, 
    LikeAPostHandler, UnlikeAPostHandler, DislikeAPostHandler, 
    RevertDislikeAPostHandler } from 'src/controllers/blog';

const router = express.Router();

// Signup
router.post('/', protectRoute, SignUpHandler);

// Login
router.post('/', protectRoute, LoginHandler);

// Create a post
router.post('/', protectRoute, CreatePostHandler);

// Get all posts
router.get('/', GetAllPostHandler);

// Get a post
router.post('/:postId', GetAPostHandler);

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


export default router;
