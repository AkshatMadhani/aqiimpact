import express from 'express';
import { calculatePersonalExposure, getExposureHistory } from '../controller/exposure.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate', auth, calculatePersonalExposure);
router.get('/history', auth, getExposureHistory);

export default router;