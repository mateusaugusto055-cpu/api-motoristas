import { Router } from 'express';
import WebAuthController from '../controllers/webAuthController.js';

const router = Router();

router.get('/login', WebAuthController.loginPage);
router.post('/login', WebAuthController.login);
router.get('/register', WebAuthController.registerPage);
router.post('/register', WebAuthController.register);
router.get('/logout', WebAuthController.logout);

export default router;