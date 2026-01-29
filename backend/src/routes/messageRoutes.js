import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getMessages, 
  deleteMessage, 
  editMessage 
} from '../controllers/messageController.js';

const router = express.Router();

router.use(authenticate);

router.get('/:roomId', getMessages);
router.delete('/:messageId', deleteMessage);
router.put('/:messageId', editMessage);

export default router;
