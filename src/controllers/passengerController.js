import PassengerService from '../services/passenger.service.js';

class PassengerController {
    static async listarPassengers(req, res, next) {
        try {
            const passengers = await PassengerService.findAll();
            res.status(200).json(passengers);
        } catch (error) {
            next(error);
        }
    }

    static async buscarPassengerPorId(req, res, next) {
        try {
            const { id } = req.params;
            const passenger = await PassengerService.findById(id);
            res.status(200).json(passenger);
        } catch (error) {
            next(error);
        }
    }

    static async criarPassenger(req, res, next) {
        try {
            const novoPassenger = await PassengerService.create(req.body);
            res.status(201).json(novoPassenger);
        } catch (error) {
            next(error);
        }
    }

    static async substituirPassenger(req, res, next) {
        try {
            const { id } = req.params;
            const passenger = await PassengerService.update(id, req.body);
            res.status(200).json(passenger);
        } catch (error) {
            next(error);
        }
    }

    static async atualizarPassengerParcial(req, res, next) {
        try {
            const { id } = req.params;
            const passenger = await PassengerService.patch(id, req.body);
            res.status(200).json(passenger);
        } catch (error) {
            next(error);
        }
    }

    static async deletarPassenger(req, res, next) {
        try {
            const { id } = req.params;
            await PassengerService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default PassengerController;