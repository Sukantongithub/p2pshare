import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getPlans,
  upgradePlan,
  getCurrentSubscription,
  cancelSubscription,
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/upgrade', authenticateToken, upgradePlan);
router.get('/current', authenticateToken, getCurrentSubscription);
router.post('/cancel', authenticateToken, cancelSubscription);

export default router;
