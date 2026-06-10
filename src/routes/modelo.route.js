import { Router } from 'express';
import { getModelos, getModeloById, createModelo, deleteModelo } from '../controllers/modelo.controller.js';

const router = Router();

router.get('/', getModelos);
router.get('/:id', getModeloById);
router.post('/', createModelo);
router.delete('/:id', deleteModelo);

export default router;