import { Router } from 'express';
import WebAdminController from '../controllers/webAdminController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação e papel de admin
router.use(authMiddleware);
router.use(authorize('admin'));

// Página do painel admin
router.get('/admin/users', WebAdminController.adminPage);

// ✅ ROTAS DE EXCLUSÃO
router.post('/admin/delete/motorista/:id', WebAdminController.deleteDriver);
router.post('/admin/delete/passageiro/:id', WebAdminController.deletePassenger);

export default router;