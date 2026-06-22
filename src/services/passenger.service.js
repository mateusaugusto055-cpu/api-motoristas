import PassengerRepository from '../repositories/passenger.repository.js';

class PassengerService {
    static async findAll() {
        return await PassengerRepository.findAll();
    }

    static async findById(id) {
        const passenger = await PassengerRepository.findById(id);
        if (!passenger) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return passenger;
    }

    // ✅ NOVO MÉTODO: Buscar por email
    static async findByEmail(email) {
        const passenger = await PassengerRepository.findByEmail(email);
        if (!passenger) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return passenger;
    }

    static async create(passengerData) {
        return await PassengerRepository.create(passengerData);
    }

    static async update(id, passengerData) {
        const updated = await PassengerRepository.update(id, passengerData);
        if (!updated) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return updated;
    }

    static async patch(id, dadosParciais) {
        const updated = await PassengerRepository.patch(id, dadosParciais);
        if (!updated) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return updated;
    }

    static async delete(id) {
        const deleted = await PassengerRepository.delete(id);
        if (!deleted) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default PassengerService;