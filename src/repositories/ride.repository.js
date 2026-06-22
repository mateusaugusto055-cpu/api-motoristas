import Ride from '../models/ride.model.js';
import mongoose from 'mongoose';

class RideRepository {
    static async findAll() {
        return await Ride.find();
    }

    static async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Ride.findById(id);
    }

    static async findByPassageiroId(passageiroId) {
        if (!mongoose.Types.ObjectId.isValid(passageiroId)) {
            return null;
        }
        return await Ride.find({ passageiroId: passageiroId }).sort({ createdAt: -1 });
    }

    static async findByMotoristaId(motoristaId) {
        if (!mongoose.Types.ObjectId.isValid(motoristaId)) {
            return null;
        }
        return await Ride.find({ motoristaId: motoristaId }).sort({ createdAt: -1 });
    }

    static async findSolicitadas() {
        return await Ride.find({ status: 'solicitada' }).sort({ createdAt: 1 });
    }

    static async create(rideData) {
        return await Ride.create(rideData);
    }

    static async update(id, rideData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Ride.findByIdAndUpdate(id, rideData, { new: true });
    }

    static async updateStatus(id, status) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const updateData = { status };
        
        // Atualizar timestamps específicos
        if (status === 'aceita') {
            updateData.data_aceite = new Date();
        } else if (status === 'em_andamento') {
            updateData.data_inicio = new Date();
        } else if (status === 'concluida') {
            updateData.data_fim = new Date();
        }
        
        return await Ride.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await Ride.findByIdAndDelete(id);
    }
}

export default RideRepository;