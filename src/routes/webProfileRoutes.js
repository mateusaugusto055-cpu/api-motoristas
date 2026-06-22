import { Router } from 'express';
import WebProfileController from '../controllers/webProfileController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', WebProfileController.profilePage);
router.get('/profile/edit', WebProfileController.editProfilePage);
router.post('/profile/edit', WebProfileController.editProfile);
router.get('/profile/delete', WebProfileController.deleteProfile);

export default router;