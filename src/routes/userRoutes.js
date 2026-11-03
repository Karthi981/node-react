import express from 'express';
import {
  createUser,
  getCurrentUser,
  login,
  logout,
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, getCurrentUser);

export default router;