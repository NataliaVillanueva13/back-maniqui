import { Router } from 'express';
import { getColores, getColorById, createColor, updateColor, deleteColor, getMateriales, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../controllers/catalogo.controller.js';

const router = Router();

router.get('/colores', getColores);
router.get('/colores/:id', getColorById);
router.post('/colores', createColor);
router.put('/colores/:id', updateColor);
router.delete('/colores/:id', deleteColor);

router.get('/materiales', getMateriales);
router.get('/materiales/:id', getMaterialById);
router.post('/materiales', createMaterial);
router.put('/materiales/:id', updateMaterial);
router.delete('/materiales/:id', deleteMaterial);

export default router;