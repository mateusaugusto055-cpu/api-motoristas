import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025';

class AuthController {
    static async login(req, res, next) {
        try {
            const { login, senha } = req.body;
            
            if (!login || !senha) {
                const error = new Error('Login e senha são obrigatórios');
                error.statusCode = 400;
                throw error;
            }
            
            const user = await UserService.findByLogin(login);
            
            if (!user) {
                const error = new Error('Usuário não encontrado');
                error.statusCode = 401;
                throw error;
            }
            
            // Comparar senha usando bcrypt diretamente
            const senhaValida = await bcrypt.compare(senha, user.senha);
            
            if (!senhaValida) {
                const error = new Error('Senha inválida');
                error.statusCode = 401;
                throw error;
            }
            
            const payload = { 
                id: user._id, 
                login: user.login, 
                nome: user.nome,
                role: user.role
            };
            
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' });
            
            res.status(200).json({
                user: {
                    id: user._id,
                    nome: user.nome,
                    email: user.email,
                    login: user.login,
                    role: user.role
                },
                token,
                message: 'Autenticação realizada com sucesso!'
            });
            
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;