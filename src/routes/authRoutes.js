import { Router } from 'express';
import AuthController from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 example: "admin"
 *               senha:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       400:
 *         description: Dados incompletos
 */
router.post('/login', AuthController.login);

export default router;