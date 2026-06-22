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

/**
 * @swagger
 * /passengers:
 *   get:
 *     summary: Lista todos os passageiros (requer autenticação)
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de passageiros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Passenger'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/', PassengerController.listarPassengers);

/**
 * @swagger
 * /passengers/{id}:
 *   get:
 *     summary: Busca um passageiro por ID
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do passageiro
 *     responses:
 *       200:
 *         description: Passageiro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Passenger'
 *       404:
 *         description: Passageiro não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/:id', getPassengerByIdValidation, handleValidationErrors, PassengerController.buscarPassengerPorId);

/**
 * @swagger
 * /passengers:
 *   post:
 *     summary: Cria um novo passageiro (apenas ADMIN)
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Santos
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *               telefone:
 *                 type: string
 *                 example: (11) 88888-8888
 *     responses:
 *       201:
 *         description: Passageiro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Passenger'
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post('/', 
    authorize('admin'),
    createPassengerValidation, 
    handleValidationErrors, 
    PassengerController.criarPassenger
);

/**
 * @swagger
 * /passengers/{id}:
 *   put:
 *     summary: Substitui um passageiro completamente (apenas ADMIN)
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Passenger'
 *     responses:
 *       200:
 *         description: Passageiro atualizado com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Passageiro não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.put('/:id', 
    authorize('admin'),
    updatePassengerValidation, 
    handleValidationErrors, 
    PassengerController.substituirPassenger
);

/**
 * @swagger
 * /passengers/{id}:
 *   patch:
 *     summary: Atualiza um passageiro parcialmente (apenas ADMIN)
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo]
 *     responses:
 *       200:
 *         description: Passageiro atualizado com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Passageiro não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.patch('/:id', 
    authorize('admin'),
    patchPassengerValidation, 
    handleValidationErrors, 
    PassengerController.atualizarPassengerParcial
);

/**
 * @swagger
 * /passengers/{id}:
 *   delete:
 *     summary: Remove um passageiro (apenas ADMIN)
 *     tags: [Passageiros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Passageiro removido com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Passageiro não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.delete('/:id', 
    authorize('admin'),
    deletePassengerValidation, 
    handleValidationErrors, 
    PassengerController.deletarPassenger
);

export default router;