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

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Lista todos os motoristas (requer autenticação)
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de motoristas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/', DriverController.listarDrivers);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Busca um motorista por ID
 *     tags: [Motoristas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do motorista
 *     responses:
 *       200:
 *         description: Motorista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Motorista não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get('/:id', getDriverByIdValidation, handleValidationErrors, DriverController.buscarDriverPorId);

/**
 * @swagger
 * /drivers:
 *   post:
 *     summary: Cria um novo motorista (apenas ADMIN)
 *     tags: [Motoristas]
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
 *               - modelo
 *               - ano
 *               - placa
 *               - cnh
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               telefone:
 *                 type: string
 *                 example: (11) 99999-9999
 *               modelo:
 *                 type: string
 *                 example: Fiat Argo
 *               ano:
 *                 type: number
 *                 example: 2022
 *               placa:
 *                 type: string
 *                 example: ABC-1234
 *               cnh:
 *                 type: string
 *                 example: 12345678901
 *     responses:
 *       201:
 *         description: Motorista criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post('/', 
    authorize('admin'),
    createDriverValidation, 
    handleValidationErrors, 
    DriverController.criarDriver
);

/**
 * @swagger
 * /drivers/{id}:
 *   put:
 *     summary: Substitui um motorista completamente (apenas ADMIN)
 *     tags: [Motoristas]
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
 *             $ref: '#/components/schemas/Driver'
 *     responses:
 *       200:
 *         description: Motorista atualizado com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Motorista não encontrado
 */
router.put('/:id', 
    authorize('admin'),
    updateDriverValidation, 
    handleValidationErrors, 
    DriverController.substituirDriver
);

/**
 * @swagger
 * /drivers/{id}:
 *   patch:
 *     summary: Atualiza um motorista parcialmente (apenas ADMIN)
 *     tags: [Motoristas]
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
 *                 enum: [ativo, inativo, bloqueado]
 *     responses:
 *       200:
 *         description: Motorista atualizado com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Motorista não encontrado
 */
router.patch('/:id', 
    authorize('admin'),
    patchDriverValidation, 
    handleValidationErrors, 
    DriverController.atualizarDriverParcial
);

/**
 * @swagger
 * /drivers/{id}:
 *   delete:
 *     summary: Remove um motorista (apenas ADMIN)
 *     tags: [Motoristas]
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
 *         description: Motorista removido com sucesso
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 *       404:
 *         description: Motorista não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.delete('/:id', 
    authorize('admin'),
    deleteDriverValidation, 
    handleValidationErrors, 
    DriverController.deletarDriver
);

export default router;