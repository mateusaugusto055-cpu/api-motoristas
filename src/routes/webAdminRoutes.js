import { Router } from 'express';
import WebAdminController from '../controllers/webAdminController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação e papel de admin
router.use(authMiddleware);
router.use(authorize('admin'));

// Página do painel admin (agora em /admin/users)
router.get('/users', WebAdminController.adminPage);

// Rotas de exclusão (agora em /admin/delete/...)
router.post('/delete/motorista/:id', WebAdminController.deleteDriver);
router.post('/delete/passageiro/:id', WebAdminController.deletePassenger);

export default router;