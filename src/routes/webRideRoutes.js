import { Router } from 'express';
import WebRideController from '../controllers/webRideController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// ⚠️ ROTAS ESPECÍFICAS PRIMEIRO (antes da rota com :id)
router.get('/rides/request', WebRideController.requestPage);
router.post('/rides/request', WebRideController.requestRide);
router.get('/rides/passenger', WebRideController.passengerRides);
router.get('/rides/driver', WebRideController.driverRides);
router.get('/rides/available', WebRideController.availableRides);

// Ações (também específicas)
router.post('/rides/:id/aceitar', WebRideController.acceptRide);
router.post('/rides/:id/iniciar', WebRideController.startRide);
router.post('/rides/:id/concluir', WebRideController.completeRide);
router.post('/rides/:id/cancelar', WebRideController.cancelRide);

// ⚠️ ROTA COM PARÂMETRO POR ÚLTIMO (se existir)
// router.get('/rides/:id', WebRideController.viewRide);

export default router;