import Driver from '../models/driver.model.js';

class DriverRepository {
    static async findAll() {
        return await Driver.find();
    }

    static async findById(id) {
        return await Driver.findOne({ id: id }) || await Driver.findById(id);
    }

    static async create(driverData) {
        return await Driver.create(driverData);
    }

    static async update(id, driverData) {
        return await Driver.findOneAndUpdate(
            { id: id },
            driverData,
            { new: true, upsert: false }
        );
    }

    static async patch(id, dadosParciais) {
        return await Driver.findOneAndUpdate(
            { id: id },
            dadosParciais,
            { new: true }
        );
    }

    static async delete(id) {
        return await Driver.findOneAndDelete({ id: id });
    }
}

export default DriverRepository;