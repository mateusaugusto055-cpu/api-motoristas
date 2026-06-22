import { Router } from 'express';
import RideController from '../controllers/rideController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Corridas
router.get('/', RideController.listarCorridas);
router.get('/solicitadas', RideController.corridasSolicitadas);
router.get('/passageiro', RideController.corridasPassageiro);
router.get('/motorista', RideController.corridasMotorista);
router.get('/:id', RideController.buscarCorridaPorId);

// Ações
router.post('/', RideController.solicitarCorrida);
router.patch('/:id/aceitar', RideController.aceitarCorrida);
router.patch('/:id/iniciar', RideController.iniciarCorrida);
router.patch('/:id/concluir', RideController.concluirCorrida);
router.patch('/:id/cancelar', RideController.cancelarCorrida);

export default router;