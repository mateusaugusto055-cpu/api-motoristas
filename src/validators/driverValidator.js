import { body, param } from 'express-validator';

export const createDriverValidation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
    body('email')
        .isEmail().withMessage('Email inválido'),
    body('telefone')
        .notEmpty().withMessage('Telefone é obrigatório'),
    body('cpf')
        .notEmpty().withMessage('CPF é obrigatório'),
    body('cnh')
        .notEmpty().withMessage('CNH é obrigatória'),
    body('placa')
        .notEmpty().withMessage('Placa é obrigatória'),
    body('modelo')
        .notEmpty().withMessage('Modelo é obrigatório')
];

export const updateDriverValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo'),
    body('nome')
        .notEmpty().withMessage('O nome é obrigatório')
];

export const getDriverByIdValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];

export const patchDriverValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];

export const deleteDriverValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];