import { Router } from 'express';
import WebAdminController from '../controllers/webAdminController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(authorize('admin'));

router.get('/admin/users', WebAdminController.adminPage);
router.get('/admin/users/suspend/:id', WebAdminController.suspendUser);
router.get('/admin/users/activate/:id', WebAdminController.activateUser);
router.get('/admin/users/delete/:id', WebAdminController.deleteUser);

export default router;