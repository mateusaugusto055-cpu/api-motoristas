import jwt from 'jsonwebtoken';

const SECRET_KEY = 'minha-chave-secreta-super-segura-2025';

/**
 * Middleware para proteger rotas
 * Verifica se o token JWT foi fornecido e é válido
 * Extrai os dados do usuário (incluindo role) e adiciona ao req.user
 */
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido. Faça login para obter um token.'
        });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Formato do token inválido. Use: Bearer <token>'
        });
    }
    
    const token = parts[1];
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 🔐 Adiciona os dados do usuário (incluindo role) na requisição
        req.user = {
            id: decoded.id,
            login: decoded.login,
            nome: decoded.nome,
            role: decoded.role  // ← IMPORTANTE: extraindo o papel do token
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