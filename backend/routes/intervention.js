import express from 'express';
import { simulateAction,logIntervention,getInterventions,getHighRiskZonesController } from '../controller/intervention.js';
import auth from '../middleware/auth.js';
import isadmin from '../middleware/admins.js';

const router = express.Router();

router.post('/simulate', simulateAction);
router.post('/log', auth, isadmin, logIntervention);
router.get('/:city', getInterventions);
router.get('/:city/high-risk-zones', getHighRiskZonesController);

export default router;