import RideService from '../services/ride.service.js';
import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';

class WebRideController {
    // Página para solicitar corrida
    static async requestPage(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            res.render('rides/request', {
                title: 'Solicitar Corrida',
                user,
                error: null,
                success: null
            });
        } catch (error) {
            console.error('Erro em requestPage:', error);
            res.render('rides/request', {
                title: 'Solicitar Corrida',
                user: req.user,
                error: 'Erro ao carregar página',
                success: null
            });
        }
    }

    // Processar solicitação de corrida
    static async requestRide(req, res) {
        try {
            const passageiroId = req.user.id;
            const { origem, destino, distancia_km, valor_estimado } = req.body;

            if (!origem || !destino) {
                const user = await UserService.findById(req.user.id);
                return res.render('rides/request', {
                    title: 'Solicitar Corrida',
                    user,
                    error: 'Origem e destino são obrigatórios',
                    success: null
                });
            }

            const rideData = {
                passageiroId,
                origem,
                destino,
                distancia_km: parseFloat(distancia_km) || 0,
                valor_estimado: parseFloat(valor_estimado) || 0
            };

            const novaCorrida = await RideService.create(rideData);

            res.redirect(`/rides/passenger?success=Corrida solicitada com sucesso!`);
        } catch (error) {
            console.error('Erro em requestRide:', error);
            const user = await UserService.findById(req.user.id);
            res.render('rides/request', {
                title: 'Solicitar Corrida',
                user,
                error: error.message || 'Erro ao solicitar corrida',
                success: null
            });
        }
    }

    // Página de corridas do passageiro
    static async passengerRides(req, res) {
        try {
            const passageiroId = req.user.id;
            const rides = await RideService.findByPassageiroId(passageiroId);
            const user = await UserService.findById(req.user.id);

            const ridesComMotorista = await Promise.all(rides.map(async (ride) => {
                const rideObj = ride.toObject ? ride.toObject() : ride;
                
                if (rideObj.motoristaId) {
                    const motorista = await DriverService.findById(rideObj.motoristaId);
                    if (motorista) {
                        rideObj.motorista = {
                            nome: motorista.nome,
                            modelo: motorista.modelo,
                            placa: motorista.placa,
                            telefone: motorista.telefone
                        };
                    }
                }
                return rideObj;
            }));

            res.render('rides/passenger', {
                title: 'Minhas Corridas',
                user,
                rides: ridesComMotorista || [],
                error: req.query.error || null,
                success: req.query.success || null
            });
        } catch (error) {
            console.error('Erro em passengerRides:', error);
            res.render('rides/passenger', {
                title: 'Minhas Corridas',
                user: req.user,
                rides: [],
                error: 'Erro ao carregar corridas',
                success: null
            });
        }
    }

    // ✅ Página de corridas do motorista - COM DADOS DO PASSAGEIRO
    static async driverRides(req, res) {
        try {
            const usuarioId = req.user.id;
            const motorista = await DriverService.findByUsuarioId(usuarioId);
            
            if (!motorista) {
                return res.render('rides/driver', {
                    title: 'Minhas Corridas (Motorista)',
                    user: req.user,
                    rides: [],
                    error: 'Motorista não encontrado. Verifique seu cadastro.',
                    success: null
                });
            }

            const rides = await RideService.findByMotoristaId(motorista._id);
            const user = await UserService.findById(req.user.id);

            // ✅ Buscar dados do passageiro para cada corrida
            const ridesComPassageiro = await Promise.all(rides.map(async (ride) => {
                const rideObj = ride.toObject ? ride.toObject() : ride;
                
                if (rideObj.passageiroId) {
                    const passageiro = await UserService.findById(rideObj.passageiroId);
                    if (passageiro) {
                        rideObj.passageiro = {
                            nome: passageiro.nome,
                            email: passageiro.email,
                            telefone: passageiro.telefone
                        };
                    }
                }
                return rideObj;
            }));

            res.render('rides/driver', {
                title: 'Minhas Corridas (Motorista)',
                user,
                rides: ridesComPassageiro || [],
                error: req.query.error || null,
                success: req.query.success || null
            });
        } catch (error) {
            console.error('Erro em driverRides:', error);
            res.render('rides/driver', {
                title: 'Minhas Corridas (Motorista)',
                user: req.user,
                rides: [],
                error: 'Erro ao carregar corridas',
                success: null
            });
        }
    }

    // Página de corridas disponíveis
    static async availableRides(req, res) {
        try {
            const rides = await RideService.findSolicitadas();
            const user = await UserService.findById(req.user.id);

            const ridesComPassageiro = await Promise.all(rides.map(async (ride) => {
                const passenger = await UserService.findById(ride.passageiroId);
                return {
                    ...ride.toObject(),
                    passageiroId: passenger || { nome: 'Não informado' }
                };
            }));

            res.render('rides/available', {
                title: 'Corridas Disponíveis',
                user,
                rides: ridesComPassageiro || [],
                error: req.query.error || null,
                success: req.query.success || null
            });
        } catch (error) {
            console.error('Erro em availableRides:', error);
            res.render('rides/available', {
                title: 'Corridas Disponíveis',
                user: req.user,
                rides: [],
                error: 'Erro ao carregar corridas disponíveis',
                success: null
            });
        }
    }

    // Aceitar corrida
    static async acceptRide(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.user.id;
            
            const motorista = await DriverService.findByUsuarioId(usuarioId);
            if (!motorista) {
                return res.redirect(`/rides/driver?error=Motorista não encontrado. Faça login novamente.`);
            }
            
            await RideService.aceitarCorrida(id, motorista._id);
            res.redirect('/rides/driver?success=Corrida aceita com sucesso!');
        } catch (error) {
            console.error('Erro em acceptRide:', error);
            res.redirect(`/rides/driver?error=${error.message}`);
        }
    }

    // Iniciar corrida
    static async startRide(req, res) {
        try {
            const { id } = req.params;
            await RideService.iniciarCorrida(id);
            res.redirect('/rides/driver?success=Corrida iniciada!');
        } catch (error) {
            console.error('Erro em startRide:', error);
            res.redirect(`/rides/driver?error=${error.message}`);
        }
    }

    // Concluir corrida
    static async completeRide(req, res) {
        try {
            const { id } = req.params;
            const { valor_final } = req.body;
            await RideService.concluirCorrida(id, parseFloat(valor_final));
            res.redirect('/rides/driver?success=Corrida concluída!');
        } catch (error) {
            console.error('Erro em completeRide:', error);
            res.redirect(`/rides/driver?error=${error.message}`);
        }
    }

    // Cancelar corrida
    static async cancelRide(req, res) {
        try {
            const { id } = req.params;
            await RideService.cancelarCorrida(id);
            res.redirect('back');
        } catch (error) {
            console.error('Erro em cancelRide:', error);
            res.redirect(`/rides/driver?error=${error.message}`);
        }
    }
}

export default WebRideController;