import { Router } from 'express';
import PassengerController from '../controllers/passengerController.js';
import {
    createPassengerValidation,
    updatePassengerValidation,
    patchPassengerValidation,
    getPassengerByIdValidation,
    deletePassengerValidation
} from '../validators/passengerValidator.js';
import { handleValidationErrors } from '../middlewares/validatorMiddleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Rotas públicas (qualquer um autenticado pode ver)
router.get('/', PassengerController.listarPassengers);
router.get('/:id', getPassengerByIdValidation, handleValidationErrors, PassengerController.buscarPassengerPorId);

// Rotas protegidas - Apenas ADMIN pode criar, atualizar ou deletar
router.post('/', 
    authorize('admin'),  // ← Apenas admin pode criar
    createPassengerValidation, 
    handleValidationErrors, 
    PassengerController.criarPassenger
);

router.put('/:id', 
    authorize('admin'),  // ← Apenas admin pode atualizar
    updatePassengerValidation, 
    handleValidationErrors, 
    PassengerController.substituirPassenger
);

router.patch('/:id', 
    authorize('admin'),  // ← Apenas admin pode atualizar
    patchPassengerValidation, 
    handleValidationErrors, 
    PassengerController.atualizarPassengerParcial
);

router.delete('/:id', 
    authorize('admin'),  // ← Apenas admin pode deletar
    deletePassengerValidation, 
    handleValidationErrors, 
    PassengerController.deletarPassenger
);

export default router;
