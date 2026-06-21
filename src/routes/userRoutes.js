import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Todas as rotas de usuário exigem autenticação e papel de admin
router.use(authMiddleware);
router.use(authorize('admin'));

router.get('/', UserController.listarUsers);
router.get('/:id', UserController.buscarUserPorId);
router.post('/', UserController.criarUser);
router.put('/:id', UserController.atualizarUser);
router.delete('/:id', UserController.deletarUser);

export default router;