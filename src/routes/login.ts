import express from 'express'; // Import express framework
import { LoginHandler } from '../controllers/blog'; // Import route handler

// Create an express instance router
const router = express.Router();

// Login
router.post('/login', LoginHandler);

// Export the router for use in the app.ts file
export default router;