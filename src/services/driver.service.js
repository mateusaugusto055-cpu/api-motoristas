import DriverRepository from '../repositories/driver.repository.js';
import { DriverResponseDTO, CreateDriverDTO } from '../dtos/driver.dto.js';

class DriverService {
    static async findAll() {
        const drivers = await DriverRepository.findAll();
        return drivers.map(driver => new DriverResponseDTO(driver));
    }

    static async findById(id) {
        const driver = await DriverRepository.findById(Number(id));
        if (!driver) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return new DriverResponseDTO(driver);
    }

    static async create(createDriverData) {
        const driverDTO = new CreateDriverDTO(createDriverData);
        
        if (!driverDTO.nome || driverDTO.nome.trim().length < 3) {
            const error = new Error('Nome deve ter pelo menos 3 caracteres');
            error.statusCode = 400;
            throw error;
        }
        
        const novoDriver = await DriverRepository.create(driverDTO);
        return new DriverResponseDTO(novoDriver);
    }

    static async update(id, driverData) {
        const driverDTO = new CreateDriverDTO(driverData);
        const driverAtualizado = await DriverRepository.update(Number(id), driverDTO);
        
        if (!driverAtualizado) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        
        return new DriverResponseDTO(driverAtualizado);
    }

    static async patch(id, dadosParciais) {
        const driverAtualizado = await DriverRepository.patch(Number(id), dadosParciais);
        
        if (!driverAtualizado) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        
        return new DriverResponseDTO(driverAtualizado);
    }

    static async delete(id) {
        const deletado = await DriverRepository.delete(Number(id));
        if (!deletado) {
            const error = new Error('Motorista não encontrado');
            error.statusCode = 404;
            throw error;
        }
        return true;
    }
}

export default DriverService;