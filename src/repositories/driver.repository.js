import Driver from '../models/driver.model.js';

class DriverRepository {
    static async findAll() {
        return await Driver.find();
    }

    static async findById(id) {
        return await Driver.findById(id);
    }

    static async create(driverData) {
        return await Driver.create(driverData);
    }

    static async update(id, driverData) {
        return await Driver.findByIdAndUpdate(id, driverData, { new: true });
    }

    static async patch(id, dadosParciais) {
        return await Driver.findByIdAndUpdate(id, dadosParciais, { new: true });
    }

    static async delete(id) {
        return await Driver.findByIdAndDelete(id);
    }
}

export default DriverRepository;
