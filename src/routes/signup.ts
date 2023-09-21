import express from 'express';
import { SignUpHandler } from '../controllers/blog';

const router = express.Router();

// Signup
router.post('/signup', SignUpHandler);

export default router;