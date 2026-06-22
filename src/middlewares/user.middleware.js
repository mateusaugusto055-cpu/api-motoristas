import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js';

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025';

export const setUserMiddleware = async (req, res, next) => {
    const token = req.cookies?.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const user = await UserService.findById(decoded.id);
            res.locals.user = user ? { ...user.toObject(), role: user.role, tipo: user.tipo } : null;
        } catch {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    
    next();
};