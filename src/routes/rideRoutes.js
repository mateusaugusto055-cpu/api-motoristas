import { Router } from 'express';
import RideController from '../controllers/rideController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/permission.middleware.js';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Lista todas as corridas (apenas ADMIN)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de corridas retornada com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 */
router.get('/', authorize('admin'), RideController.listarCorridas);

/**
 * @swagger
 * /rides/passageiro:
 *   get:
 *     summary: Lista as corridas do passageiro logado
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de corridas do passageiro
 */
router.get('/passageiro', RideController.corridasPassageiro);

/**
 * @swagger
 * /rides/motorista:
 *   get:
 *     summary: Lista as corridas do motorista logado
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de corridas do motorista
 */
router.get('/motorista', RideController.corridasMotorista);

/**
 * @swagger
 * /rides/solicitadas:
 *   get:
 *     summary: Lista as corridas solicitadas (disponíveis para motoristas)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de corridas disponíveis
 */
router.get('/solicitadas', RideController.corridasSolicitadas);

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Solicita uma nova corrida (passageiro)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origem
 *               - destino
 *             properties:
 *               origem:
 *                 type: string
 *                 example: Av. Paulista, 1000
 *               destino:
 *                 type: string
 *                 example: Rua Augusta, 500
 *               distancia_km:
 *                 type: number
 *                 example: 5.2
 *     responses:
 *       201:
 *         description: Corrida solicitada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', RideController.solicitarCorrida);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Busca uma corrida por ID
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Corrida encontrada
 *       404:
 *         description: Corrida não encontrada
 */
router.get('/:id', RideController.buscarCorridaPorId);

/**
 * @swagger
 * /rides/{id}/aceitar:
 *   patch:
 *     summary: Aceita uma corrida (motorista)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Corrida aceita com sucesso
 *       400:
 *         description: Corrida não disponível
 *       404:
 *         description: Corrida não encontrada
 */
router.patch('/:id/aceitar', RideController.aceitarCorrida);

/**
 * @swagger
 * /rides/{id}/iniciar:
 *   patch:
 *     summary: Inicia uma corrida (motorista)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Corrida iniciada com sucesso
 *       400:
 *         description: Corrida não pode ser iniciada
 *       404:
 *         description: Corrida não encontrada
 */
router.patch('/:id/iniciar', RideController.iniciarCorrida);

/**
 * @swagger
 * /rides/{id}/concluir:
 *   patch:
 *     summary: Conclui uma corrida (motorista)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor_final:
 *                 type: number
 *                 example: 25.50
 *     responses:
 *       200:
 *         description: Corrida concluída com sucesso
 *       400:
 *         description: Corrida não pode ser concluída
 *       404:
 *         description: Corrida não encontrada
 */
router.patch('/:id/concluir', RideController.concluirCorrida);

/**
 * @swagger
 * /rides/{id}/cancelar:
 *   patch:
 *     summary: Cancela uma corrida (passageiro ou motorista)
 *     tags: [Corridas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Corrida cancelada com sucesso
 *       400:
 *         description: Corrida não pode ser cancelada
 *       404:
 *         description: Corrida não encontrada
 */
router.patch('/:id/cancelar', RideController.cancelarCorrida);

export default router;