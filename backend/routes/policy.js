import express from 'express';
import { getCityPolicy } from '../controller/policy.js';
const router = express.Router();

router.get('/', getCityPolicy);

export default router;