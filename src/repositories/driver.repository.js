import Driver from '../models/driver.model.js';
import mongoose from 'mongoose';

class DriverRepository {
    static async findAll() {
        return await Driver.find();
    }

    static async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Driver.findById(id);
    }

    static async findByUsuarioId(usuarioId) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Driver.findOne({ usuarioId: usuarioId });
    }

    static async findByEmail(email) {
        return await Driver.findOne({ email: email });
    }

    static async create(driverData) {
        return await Driver.create(driverData);
    }

    static async update(id, driverData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Driver.findByIdAndUpdate(id, driverData, { new: true });
    }

    static async updateByUsuarioId(usuarioId, driverData) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Driver.findOneAndUpdate(
            { usuarioId: usuarioId },
            driverData,
            { new: true }
        );
    }

    static async patch(id, dadosParciais) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Driver.findByIdAndUpdate(id, dadosParciais, { new: true });
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Driver.findByIdAndDelete(id);
    }

    static async deleteByUsuarioId(usuarioId) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Driver.findOneAndDelete({ usuarioId: usuarioId });
    }
}

export default DriverRepository;