import RideService from '../services/ride.service.js';

class RideController {
    // Listar todas as corridas (admin)
    static async listarCorridas(req, res, next) {
        try {
            const rides = await RideService.findAll();
            res.status(200).json(rides);
        } catch (error) {
            next(error);
        }
    }

    // Buscar corrida por ID
    static async buscarCorridaPorId(req, res, next) {
        try {
            const { id } = req.params;
            const ride = await RideService.findById(id);
            res.status(200).json(ride);
        } catch (error) {
            next(error);
        }
    }

    // Corridas do passageiro
    static async corridasPassageiro(req, res, next) {
        try {
            const passageiroId = req.user.id;
            const rides = await RideService.findByPassageiroId(passageiroId);
            res.status(200).json(rides);
        } catch (error) {
            next(error);
        }
    }

    // Corridas do motorista
    static async corridasMotorista(req, res, next) {
        try {
            const motoristaId = req.user.id;
            const rides = await RideService.findByMotoristaId(motoristaId);
            res.status(200).json(rides);
        } catch (error) {
            next(error);
        }
    }

    // Corridas solicitadas (disponíveis)
    static async corridasSolicitadas(req, res, next) {
        try {
            const rides = await RideService.findSolicitadas();
            res.status(200).json(rides);
        } catch (error) {
            next(error);
        }
    }

    // Solicitar corrida (passageiro)
    static async solicitarCorrida(req, res, next) {
        try {
            const passageiroId = req.user.id;
            const { origem, destino, distancia_km } = req.body;

            if (!origem || !destino) {
                const error = new Error('Origem e destino são obrigatórios');
                error.statusCode = 400;
                throw error;
            }

            const rideData = {
                passageiroId,
                origem,
                destino,
                distancia_km: distancia_km || 0
            };

            const novaCorrida = await RideService.create(rideData);
            res.status(201).json(novaCorrida);
        } catch (error) {
            next(error);
        }
    }

    // Aceitar corrida (motorista)
    static async aceitarCorrida(req, res, next) {
        try {
            const { id } = req.params;
            const motoristaId = req.user.id;
            const ride = await RideService.aceitarCorrida(id, motoristaId);
            res.status(200).json(ride);
        } catch (error) {
            next(error);
        }
    }

    // Iniciar corrida (motorista)
    static async iniciarCorrida(req, res, next) {
        try {
            const { id } = req.params;
            const ride = await RideService.iniciarCorrida(id);
            res.status(200).json(ride);
        } catch (error) {
            next(error);
        }
    }

    // Concluir corrida (motorista)
    static async concluirCorrida(req, res, next) {
        try {
            const { id } = req.params;
            const { valor_final } = req.body;
            const ride = await RideService.concluirCorrida(id, valor_final);
            res.status(200).json(ride);
        } catch (error) {
            next(error);
        }
    }

    // Cancelar corrida (passageiro ou motorista)
    static async cancelarCorrida(req, res, next) {
        try {
            const { id } = req.params;
            const ride = await RideService.cancelarCorrida(id);
            res.status(200).json(ride);
        } catch (error) {
            next(error);
        }
    }
}

export default RideController;