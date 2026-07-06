import { Router } from 'express'; 
import { commentsController } from '../controllers/comments.controller'; 
import { authMiddleware } from '../middleware/auth.middleware'; 
 
const router = Router(); 
 
router.get('/task/:taskId', authMiddleware, commentsController.getByTask); 
router.post('/',           authMiddleware, commentsController.create); 
router.delete('/:id',      authMiddleware, commentsController.remove); 
 
export default router; 