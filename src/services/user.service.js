import UserRepository from '../repositories/user.repository.js';

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
        return await user.comparePassword(senhaDigitada);
    }

    static async create(userData) {
        return await UserRepository.create(userData);
    }

    static async update(id, userData) {
        return await UserRepository.update(id, userData);
    }

    static async delete(id) {
        return await UserRepository.delete(id);
    }
}

export default UserService;
