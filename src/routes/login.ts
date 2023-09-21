import express from 'express';
import { LoginHandler } from '../controllers/blog';

const router = express.Router();

// Signup
router.post('/login', LoginHandler);

export default router;