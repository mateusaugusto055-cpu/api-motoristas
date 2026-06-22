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

    // ✅ NOVO MÉTODO: Buscar por email
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
}

export default PassengerRepository;