import express from 'express'; // Import express framework
import { SignUpHandler } from '../controllers/blog'; // Import route handler

// Create an express router instance
const router = express.Router();

// Signup
router.post('/signup', SignUpHandler);

// Export the router for use in the app.ts file
export default router;