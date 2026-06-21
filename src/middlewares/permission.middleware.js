/**
 * Middleware de autorização baseado em papéis (RBAC)
 * Verifica se o usuário autenticado tem permissão para acessar o recurso
 * 
 * @param {...string} allowedRoles - Lista de papéis permitidos
 * @returns {Function} Middleware do Express
 * 
 * @example
 * // Apenas admin
 * authorize('admin')
 * 
 * @example
 * // Admin ou motorista
 * authorize('admin', 'motorista')
 * 
 * @example
 * // Admin, motorista ou passageiro
 * authorize('admin', 'motorista', 'passageiro')
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Verifica se o usuário está autenticado (middleware auth já deve ter sido chamado)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado. Faça login primeiro.'
            });
        }

        // Obtém o papel do usuário do token JWT
        const userRole = req.user.role;

        // Verifica se o papel do usuário está na lista de papéis permitidos
        const hasPermission = allowedRoles.includes(userRole);

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: `Acesso negado. Permissões insuficientes.`,
                details: `Papel necessário: ${allowedRoles.join(', ')} | Seu papel: ${userRole}`
            });
        }

        next();
    };
};

/**
 * Middleware para verificar se o usuário é o proprietário do recurso
 * Útil para recursos que só o dono pode modificar
 * 
 * @param {string} paramIdField - Nome do campo no req.params que contém o ID
 * @param {string} userField - Nome do campo no usuário que contém o ID
 */
export const isOwner = (paramIdField = 'id', userField = 'id') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado.'
            });
        }

        const resourceId = parseInt(req.params[paramIdField]);
        const userId = req.user.id;

        // Admin pode acessar qualquer recurso
        if (req.user.role === 'admin') {
            return next();
        }

        if (resourceId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Você só pode acessar seus próprios recursos.'
            });
        }

        next();
    };
};