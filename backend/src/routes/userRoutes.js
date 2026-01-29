import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getAllUsers, 
  getOnlineUsers, 
  getUserProfile,
  updateProfile
} from '../controllers/userController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/online', getOnlineUsers);
router.get('/:userId', getUserProfile);
router.put('/profile', updateProfile);

export default router;
