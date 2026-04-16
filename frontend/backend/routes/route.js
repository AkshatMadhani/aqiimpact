import express from 'express';
import { findSmartRoutes, compareRoutesController, calculateSingleRoute } from '../controller/route.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/find', auth, findSmartRoutes);

router.post('/compare', auth, compareRoutesController);
router.post('/calculate', auth, calculateSingleRoute);

export default router;