import { body, param } from 'express-validator';

export const createPassengerValidation = [
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome é obrigatório')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
    body('email')
        .isEmail().withMessage('Email inválido'),
    body('telefone')
        .notEmpty().withMessage('Telefone é obrigatório')
];

export const updatePassengerValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo'),
    body('nome')
        .notEmpty().withMessage('O nome é obrigatório')
];

export const getPassengerByIdValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];

export const patchPassengerValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];

export const deletePassengerValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID deve ser um número positivo')
];