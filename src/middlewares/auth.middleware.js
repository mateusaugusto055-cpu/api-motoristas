import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido. Faça login para obter um token.'
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: decoded.id,  // ← USAR O _id DO USUÁRIO
            login: decoded.login,
            nome: decoded.nome,
            role: decoded.role,
            tipo: decoded.tipo
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Faça login novamente.'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};