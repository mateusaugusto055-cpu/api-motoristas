import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';

class UserService {
    static async findAll() {
        return await UserRepository.findAll();
    }

    static async findById(id) {
        return await UserRepository.findById(id);
    }

    static async findByLogin(login) {
        return await UserRepository.findByLogin(login);
    }

    static async validatePassword(senhaDigitada, user) {
        return await bcrypt.compare(senhaDigitada, user.senha);
    }

    static async create(userData) {
        // Criptografar a senha ANTES de salvar
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(userData.senha, salt);
        
        const dataComSenhaCriptografada = {
            ...userData,
            senha: senhaHash
        };
        
        return await UserRepository.create(dataComSenhaCriptografada);
    }

    static async update(id, userData) {
        // Se a senha foi enviada, criptografar
        if (userData.senha) {
            const salt = await bcrypt.genSalt(10);
            userData.senha = await bcrypt.hash(userData.senha, salt);
        }
        return await UserRepository.update(id, userData);
    }

    static async delete(id) {
        return await UserRepository.delete(id);
    }
}

export default UserService;