import Passenger from '../models/passenger.model.js';
import mongoose from 'mongoose';

class PassengerRepository {
    static async findAll() {
        return await Passenger.find();
    }

    static async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Passenger.findById(id);
    }

    // ✅ BUSCAR PELO usuarioId
    static async findByUsuarioId(usuarioId) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Passenger.findOne({ usuarioId: usuarioId });
    }

    static async findByEmail(email) {
        return await Passenger.findOne({ email: email });
    }

    static async create(passengerData) {
        return await Passenger.create(passengerData);
    }

    static async update(id, passengerData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Passenger.findByIdAndUpdate(id, passengerData, { new: true });
    }

    // ✅ ATUALIZAR PELO usuarioId
    static async updateByUsuarioId(usuarioId, passengerData) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Passenger.findOneAndUpdate(
            { usuarioId: usuarioId },
            passengerData,
            { new: true }
        );
    }

    static async patch(id, dadosParciais) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Passenger.findByIdAndUpdate(id, dadosParciais, { new: true });
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Passenger.findByIdAndDelete(id);
    }

    // ✅ DELETAR PELO usuarioId
    static async deleteByUsuarioId(usuarioId) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return null;
        }
        return await Passenger.findOneAndDelete({ usuarioId: usuarioId });
    }
}

export default PassengerRepository;