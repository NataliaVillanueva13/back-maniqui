import { Router } from 'express';
import { getManiquies, createManiqui, getManiquiById, updateManiqui, deleteManiqui } from '../controllers/maniqui.controller.js';

const router = Router();

router.get('/', getManiquies);
router.post('/', createManiqui);
router.get('/:id', getManiquiById);
router.put('/:id', updateManiqui);
router.delete('/:id', deleteManiqui);

export default router;