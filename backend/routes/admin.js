import express from 'express';
import { getUsers, deleteUser } from '../controller/admin.js';
import { login,logout } from '../controller/auth.js';
import auth from '../middleware/auth.js';
import isadmin from '../middleware/admins.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/users', auth, isadmin, getUsers);
router.delete('/users/:id', auth, isadmin, deleteUser);

export default router;