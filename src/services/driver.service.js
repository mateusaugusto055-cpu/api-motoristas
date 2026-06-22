import DriverRepository from '../repositories/driver.repository.js';

class DriverService {
    static async findAll() {
        return await DriverRepository.findAll();
    }

    static async findById(id) {
        const driver = await DriverRepository.findById(id);
        if (!driver) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return driver;
    }

    // ✅ NOVO MÉTODO
    static async findByEmail(email) {
        const driver = await DriverRepository.findByEmail(email);
        if (!driver) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return driver;
    }

    static async create(driverData) {
        return await DriverRepository.create(driverData);
    }

    static async update(id, driverData) {
        const updated = await DriverRepository.update(id, driverData);
        if (!updated) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return updated;
    }

    static async patch(id, dadosParciais) {
        const updated = await DriverRepository.patch(id, dadosParciais);
        if (!updated) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return updated;
    }

    static async delete(id) {
        const deleted = await DriverRepository.delete(id);
        if (!deleted) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default DriverService;