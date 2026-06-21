import UserService from '../services/user.service.js';
import { UserResponseDTO } from '../dtos/user.dto.js';
import bcrypt from 'bcryptjs';

class UserController {
    // Listar todos os usuários (apenas admin)
    static async listarUsers(req, res, next) {
        try {
            const users = await UserService.findAll();
            const usersDTO = users.map(user => new UserResponseDTO(user));
            res.status(200).json(usersDTO);
        } catch (error) {
            next(error);
        }
    }

    // Buscar usuário por ID (apenas admin)
    static async buscarUserPorId(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(Number(id));
            
            if (!user) {
                const error = new Error('Usuário não encontrado');
                error.statusCode = 404;
                throw error;
            }
            
            res.status(200).json(new UserResponseDTO(user));
        } catch (error) {
            next(error);
        }
    }

    // Criar novo usuário (apenas admin)
    static async criarUser(req, res, next) {
        try {
            const { nome, email, login, senha, role } = req.body;
            
            if (!nome || !email || !login || !senha) {
                const error = new Error('Nome, email, login e senha são obrigatórios');
                error.statusCode = 400;
                throw error;
            }
            
            // Verificar se login já existe
            const existingUser = await UserService.findByLogin(login);
            if (existingUser) {
                const error = new Error('Login já existe');
                error.statusCode = 400;
                throw error;
            }
            
            // Criptografar senha
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            
            const newUser = await UserService.create({
                nome,
                email,
                login,
                senha: senhaHash,
                role: role || 'user'
            });
            
            res.status(201).json(new UserResponseDTO(newUser));
        } catch (error) {
            next(error);
        }
    }

    // Atualizar usuário (apenas admin)
    static async atualizarUser(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, email, role } = req.body;
            
            const userAtualizado = await UserService.update(Number(id), { nome, email, role });
            
            if (!userAtualizado) {
                const error = new Error('Usuário não encontrado');
                error.statusCode = 404;
                throw error;
            }
            
            res.status(200).json(new UserResponseDTO(userAtualizado));
        } catch (error) {
            next(error);
        }
    }

    // Deletar usuário (apenas admin)
    static async deletarUser(req, res, next) {
        try {
            const { id } = req.params;
            const deletado = await UserService.delete(Number(id));
            
            if (!deletado) {
                const error = new Error('Usuário não encontrado');
                error.statusCode = 404;
                throw error;
            }
            
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;