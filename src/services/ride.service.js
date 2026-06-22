import RideRepository from '../repositories/ride.repository.js';
import DriverService from './driver.service.js';

class RideService {
    static async findAll() {
        return await RideRepository.findAll();
    }

    static async findById(id) {
        const ride = await RideRepository.findById(id);
        if (!ride) {
            const error = new Error('Corrida não encontrada');
            error.statusCode = 404;
            throw error;
        }
        return ride;
    }

    static async findByPassageiroId(passageiroId) {
        return await RideRepository.findByPassageiroId(passageiroId);
    }

    static async findByMotoristaId(motoristaId) {
        return await RideRepository.findByMotoristaId(motoristaId);
    }

    static async findSolicitadas() {
        return await RideRepository.findSolicitadas();
    }

    static async create(rideData) {
        const corridasAtivas = await RideRepository.findByPassageiroId(rideData.passageiroId);
        const temCorridaAtiva = corridasAtivas.some(r => 
            ['solicitada', 'aceita', 'em_andamento'].includes(r.status)
        );
        
        if (temCorridaAtiva) {
            const error = new Error('Você já tem uma corrida em andamento');
            error.statusCode = 400;
            throw error;
        }

        const valorEstimado = (rideData.distancia_km || 0) * 2;

        const novaCorrida = {
            passageiroId: rideData.passageiroId,
            origem: rideData.origem,
            destino: rideData.destino,
            distancia_km: rideData.distancia_km || 0,
            valor_estimado: Math.round(valorEstimado * 100) / 100,
            status: 'solicitada',
            motoristaId: null,
            data_solicitacao: new Date(),
            data_aceite: null,
            data_inicio: null,
            data_fim: null
        };

        return await RideRepository.create(novaCorrida);
    }

    // ✅ ACEITAR CORRIDA - AQUI É ONDE VOCÊ DEVE COLOCAR O CÓDIGO!
    static async aceitarCorrida(id, motoristaId) {
        const ride = await RideRepository.findById(id);
        if (!ride) {
            const error = new Error('Corrida não encontrada');
            error.statusCode = 404;
            throw error;
        }

        if (ride.status !== 'solicitada') {
            const error = new Error('Esta corrida não está disponível para aceite');
            error.statusCode = 400;
            throw error;
        }

        const motorista = await DriverService.findById(motoristaId);
        if (!motorista || motorista.status !== 'ativo') {
            const error = new Error('Motorista não disponível');
            error.statusCode = 400;
            throw error;
        }

        // 🔧 AQUI É ONDE VOCÊ DEVE COLOCAR O CÓDIGO CORRIGIDO!
        // ❌ NÃO USE ISSO:
        // const updatedRide = await RideRepository.updateStatus(id, 'aceita');
        
        // ✅ USE ISSO:
        const updateData = {
            status: 'aceita',
            motoristaId: motoristaId,  // ← SALVAR O MOTORISTA ID
            data_aceite: new Date()
        };
        const updatedRide = await RideRepository.update(id, updateData);
        
        // Atualizar motorista para EM_VIAGEM
        await DriverService.update(motoristaId, { status: 'em_viagem' });

        return updatedRide;
    }

    static async iniciarCorrida(id) {
        const ride = await RideRepository.findById(id);
        if (!ride) {
            const error = new Error('Corrida não encontrada');
            error.statusCode = 404;
            throw error;
        }

        if (ride.status !== 'aceita') {
            const error = new Error('A corrida deve estar aceita para iniciar');
            error.statusCode = 400;
            throw error;
        }

        return await RideRepository.updateStatus(id, 'em_andamento');
    }

    static async concluirCorrida(id, valorFinal) {
        const ride = await RideRepository.findById(id);
        if (!ride) {
            const error = new Error('Corrida não encontrada');
            error.statusCode = 404;
            throw error;
        }

        if (ride.status !== 'em_andamento') {
            const error = new Error('A corrida deve estar em andamento para concluir');
            error.statusCode = 400;
            throw error;
        }

        const updateData = {
            status: 'concluida',
            valor_final: valorFinal || ride.valor_estimado,
            data_fim: new Date()
        };

        const updatedRide = await RideRepository.update(id, updateData);

        if (ride.motoristaId) {
            await DriverService.update(ride.motoristaId, { status: 'ativo' });
        }

        return updatedRide;
    }

    static async cancelarCorrida(id) {
        const ride = await RideRepository.findById(id);
        if (!ride) {
            const error = new Error('Corrida não encontrada');
            error.statusCode = 404;
            throw error;
        }

        if (['concluida', 'cancelada'].includes(ride.status)) {
            const error = new Error('Esta corrida já foi finalizada');
            error.statusCode = 400;
            throw error;
        }

        const updatedRide = await RideRepository.updateStatus(id, 'cancelada');

        if (ride.motoristaId) {
            await DriverService.update(ride.motoristaId, { status: 'ativo' });
        }

        return updatedRide;
    }

    static async delete(id) {
        return await RideRepository.delete(id);
    }
}

export default RideService;