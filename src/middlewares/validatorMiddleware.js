import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        return next();
    }
    
    return res.status(400).json({
        errors: errors.array(),
        message: 'Dados inválidos. Verifique os campos e tente novamente.'
    });
};