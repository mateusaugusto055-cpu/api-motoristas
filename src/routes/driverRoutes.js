import { Router } from 'express';
import DriverController from '../controllers/driverController.js';
import {
    createDriverValidation,
    updateDriverValidation,
    patchDriverValidation,
    getDriverByIdValidation,
    deleteDriverValidation
} from '../validators/driverValidator.js';
import { handleValidationErrors } from '../middlewares/validatorMiddleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Rotas públicas (qualquer um autenticado pode ver)
router.get('/', DriverController.listarDrivers);
router.get('/:id', getDriverByIdValidation, handleValidationErrors, DriverController.buscarDriverPorId);

// Rotas protegidas - Apenas ADMIN pode criar, atualizar ou deletar
router.post('/', 
    authorize('admin'),  // ← Apenas admin pode criar
    createDriverValidation, 
    handleValidationErrors, 
    DriverController.criarDriver
);

router.put('/:id', 
    authorize('admin'),  // ← Apenas admin pode atualizar
    updateDriverValidation, 
    handleValidationErrors, 
    DriverController.substituirDriver
);

router.patch('/:id', 
    authorize('admin'),  // ← Apenas admin pode atualizar
    patchDriverValidation, 
    handleValidationErrors, 
    DriverController.atualizarDriverParcial
);

router.delete('/:id', 
    authorize('admin'),  // ← Apenas admin pode deletar
    deleteDriverValidation, 
    handleValidationErrors, 
    DriverController.deletarDriver
);

export default router;
