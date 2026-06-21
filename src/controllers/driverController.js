import DriverService from '../services/driver.service.js';

class DriverController {
    static async listarDrivers(req, res, next) {
        try {
            const drivers = await DriverService.findAll();
            res.status(200).json(drivers);
        } catch (error) {
            next(error);
        }
    }

    static async buscarDriverPorId(req, res, next) {
        try {
            const { id } = req.params;
            const driver = await DriverService.findById(id);
            res.status(200).json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async criarDriver(req, res, next) {
        try {
            const novoDriver = await DriverService.create(req.body);
            res.status(201).json(novoDriver);
        } catch (error) {
            next(error);
        }
    }

    static async substituirDriver(req, res, next) {
        try {
            const { id } = req.params;
            const driver = await DriverService.update(id, req.body);
            res.status(200).json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async atualizarDriverParcial(req, res, next) {
        try {
            const { id } = req.params;
            const driver = await DriverService.patch(id, req.body);
            res.status(200).json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async deletarDriver(req, res, next) {
        try {
            const { id } = req.params;
            await DriverService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default DriverController;