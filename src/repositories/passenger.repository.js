import Passenger from '../models/passenger.model.js';

class PassengerRepository {
    static async findAll() {
        return await Passenger.find();
    }

    static async findById(id) {
        return await Passenger.findById(id);
    }

    static async create(passengerData) {
        return await Passenger.create(passengerData);
    }

    static async update(id, passengerData) {
        return await Passenger.findByIdAndUpdate(id, passengerData, { new: true });
    }

    static async patch(id, dadosParciais) {
        return await Passenger.findByIdAndUpdate(id, dadosParciais, { new: true });
    }

    static async delete(id) {
        return await Passenger.findByIdAndDelete(id);
    }
}

export default PassengerRepository;