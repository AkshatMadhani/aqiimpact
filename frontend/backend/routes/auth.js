import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
} from '../controller/auth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;
