import express from 'express';
import { getSuggestions } from '../controller/suggestion.js';
import auth from '../middleware/auth.js'
const router = express.Router();

router.post('/', auth, getSuggestions);

export default router;