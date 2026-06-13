import { Router } from 'express';

import {
  createSmoothie,
  deleteSmoothie,
  getSmoothie,
  getSmoothies,
  updateSmoothie
} from '../controllers/smoothies.controller';

const router = Router();

router.get('/', getSmoothies);
router.get('/:id', getSmoothie);
router.post('/', createSmoothie);
router.patch('/:id', updateSmoothie);
router.delete('/:id', deleteSmoothie);

export default router;
