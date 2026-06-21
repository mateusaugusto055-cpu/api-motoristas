import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';

class WebController {
    static async listDriversPage(req, res, next) {
        try {
            const drivers = await DriverService.findAll();
            res.render('drivers', {
                title: 'Motoristas - API Motoristas',
                drivers: drivers,
                totalDrivers: drivers.length
            });
        } catch (error) {
            next(error);
        }
    }

    static async listPassengersPage(req, res, next) {
        try {
            const passengers = await PassengerService.findAll();
            res.render('passengers', {
                title: 'Passageiros - API Motoristas',
                passengers: passengers,
                totalPassengers: passengers.length
            });
        } catch (error) {
            next(error);
        }
    }
}

export default WebController;