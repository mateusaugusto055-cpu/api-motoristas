import User from '../models/user.model.js';

class UserRepository {
    static async findAll() {
        return await User.find();
    }

    static async findById(id) {
        return await User.findById(id);
    }

    static async findByLogin(login) {
        return await User.findOne({ login });
    }

    static async create(userData) {
        return await User.create(userData);
    }

    static async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    static async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default UserRepository;