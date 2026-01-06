import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
