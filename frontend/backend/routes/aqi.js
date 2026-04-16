import express from 'express';
import { getCurrentAQI,getHistorical } from '../controller/api.js';
const router = express.Router();

router.get('/:city', getCurrentAQI);
router.get('/:city/historical', getHistorical);

export default router;