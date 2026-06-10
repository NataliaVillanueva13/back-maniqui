import { Router } from 'express';
import { getCabezas, getCabezaById, createCabeza, updateCabeza, deleteCabeza, getTorsos, getTorsoById, createTorso, updateTorso, deleteTorso, getBrazos, getBrazoById, createBrazo, updateBrazo, deleteBrazo, getPiernas, getPiernaById, createPierna, updatePierna, deletePierna, getStockDisponible, getStockEnUso } from '../controllers/piezas.controller.js';

const router = Router();

router.get('/stock/disponible', getStockDisponible);
router.get('/stock/uso', getStockEnUso);

router.get('/cabezas', getCabezas);
router.get('/cabezas/:id', getCabezaById);
router.post('/cabezas', createCabeza);
router.put('/cabezas/:id', updateCabeza);
router.delete('/cabezas/:id', deleteCabeza);

router.get('/torsos', getTorsos);
router.get('/torsos/:id', getTorsoById);
router.post('/torsos', createTorso);
router.put('/torsos/:id', updateTorso);
router.delete('/torsos/:id', deleteTorso);

router.get('/brazos', getBrazos);
router.get('/brazos/:id', getBrazoById);
router.post('/brazos', createBrazo);
router.put('/brazos/:id', updateBrazo);
router.delete('/brazos/:id', deleteBrazo);

router.get('/piernas', getPiernas);
router.get('/piernas/:id', getPiernaById);
router.post('/piernas', createPierna);
router.put('/piernas/:id', updatePierna);
router.delete('/piernas/:id', deletePierna);

export default router;