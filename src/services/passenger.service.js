import PassengerRepository from '../repositories/passenger.repository.js';
import { PassengerResponseDTO, CreatePassengerDTO } from '../dtos/passenger.dto.js';

class PassengerService {
    static async findAll() {
        const passengers = await PassengerRepository.findAll();
        return passengers.map(passenger => new PassengerResponseDTO(passenger));
    }

    static async findById(id) {
        const passenger = await PassengerRepository.findById(Number(id));
        if (!passenger) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return new PassengerResponseDTO(passenger);
    }

    static async create(createPassengerData) {
        const passengerDTO = new CreatePassengerDTO(createPassengerData);
        
        if (!passengerDTO.nome || passengerDTO.nome.trim().length < 3) {
            const error = new Error('Nome deve ter pelo menos 3 caracteres');
            error.statusCode = 400;
            throw error;
        }
        
        const novoPassenger = await PassengerRepository.create(passengerDTO);
        return new PassengerResponseDTO(novoPassenger);
    }

    static async update(id, passengerData) {
        const passengerDTO = new CreatePassengerDTO(passengerData);
        const passengerAtualizado = await PassengerRepository.update(Number(id), passengerDTO);
        
        if (!passengerAtualizado) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        
        return new PassengerResponseDTO(passengerAtualizado);
    }

    static async patch(id, dadosParciais) {
        const passengerAtualizado = await PassengerRepository.patch(Number(id), dadosParciais);
        
        if (!passengerAtualizado) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        
        return new PassengerResponseDTO(passengerAtualizado);
    }

    static async delete(id) {
        const deletado = await PassengerRepository.delete(Number(id));
        if (!deletado) {
            const error = new Error('Passageiro não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default PassengerService;