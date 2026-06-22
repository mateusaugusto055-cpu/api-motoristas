import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';
import mongoose from 'mongoose';

class WebProfileController {
    static async profilePage(req, res) {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email || req.user.login; // Fallback para login
            
            console.log('🔍 ID do usuário:', userId);
            console.log('🔍 Email do usuário:', userEmail);

            // Buscar usuário
            const user = await UserService.findById(userId);
            
            if (!user) {
                return res.render('profile', { 
                    title: 'Meu Perfil', 
                    user: req.user, 
                    driver: null,
                    passenger: null,
                    error: 'Usuário não encontrado', 
                    success: null 
                });
            }

            let driver = null;
            let passenger = null;
            
            // Buscar perfil correspondente
            if (user.tipo === 'motorista') {
                // Tenta buscar por ID primeiro, depois por email
                driver = await DriverService.findById(userId);
                if (!driver) {
                    // Se não encontrar por ID, busca por email
                    console.log('🔍 Motorista não encontrado por ID, buscando por email...');
                    driver = await DriverService.findByEmail(userEmail);
                }
            } else if (user.tipo === 'passageiro') {
                // Tenta buscar por ID primeiro, depois por email
                passenger = await PassengerService.findById(userId);
                if (!passenger) {
                    // Se não encontrar por ID, busca por email
                    console.log('🔍 Passageiro não encontrado por ID, buscando por email...');
                    passenger = await PassengerService.findByEmail(userEmail);
                }
            }
            
            res.render('profile', { 
                title: 'Meu Perfil', 
                user, 
                driver, 
                passenger,
                error: null, 
                success: null 
            });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            res.render('profile', { 
                title: 'Meu Perfil', 
                user: req.user, 
                driver: null,
                passenger: null,
                error: 'Erro ao carregar perfil: ' + error.message, 
                success: null 
            });
        }
    }

    static async editProfilePage(req, res) {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email || req.user.login;
            
            const user = await UserService.findById(userId);
            let driver = null;
            let passenger = null;
            
            if (user && user.tipo === 'motorista') {
                driver = await DriverService.findById(userId);
                if (!driver) {
                    driver = await DriverService.findByEmail(userEmail);
                }
            } else if (user && user.tipo === 'passageiro') {
                passenger = await PassengerService.findById(userId);
                if (!passenger) {
                    passenger = await PassengerService.findByEmail(userEmail);
                }
            }
            
            res.render('profile-edit', { 
                title: 'Editar Perfil', 
                user, 
                driver, 
                passenger,
                error: null, 
                success: null 
            });
        } catch (error) {
            console.error('Erro ao carregar edição:', error);
            res.redirect('/profile');
        }
    }

    static async editProfile(req, res) {
        try {
            const userId = req.user.id;
            const userEmail = req.user.email || req.user.login;
            const { nome, email, senha, modelo, ano, placa, cnh } = req.body;
            const updateData = { nome, email };
            
            if (senha && senha.length >= 6) {
                const bcrypt = await import('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                updateData.senha = await bcrypt.hash(senha, salt);
            }

            await UserService.update(userId, updateData);
            
            const user = await UserService.findById(userId);
            
            if (user.tipo === 'motorista') {
                const driverUpdate = { nome, email };
                if (modelo) driverUpdate.modelo = modelo;
                if (ano) driverUpdate.ano = parseInt(ano);
                if (placa) driverUpdate.placa = placa.toUpperCase();
                if (cnh) driverUpdate.cnh = cnh;
                
                // Tenta atualizar por ID, se não encontrar, cria novo
                const updated = await DriverService.update(userId, driverUpdate);
                if (!updated) {
                    await DriverService.create({
                        _id: userId,
                        ...driverUpdate
                    });
                }
            } else if (user.tipo === 'passageiro') {
                const passengerUpdate = { nome, email };
                const updated = await PassengerService.update(userId, passengerUpdate);
                if (!updated) {
                    await PassengerService.create({
                        _id: userId,
                        ...passengerUpdate,
                        telefone: '',
                        endereco: '',
                        status: 'ativo'
                    });
                }
            }

            const updatedUser = await UserService.findById(userId);
            let driver = null;
            let passenger = null;
            
            if (updatedUser.tipo === 'motorista') {
                driver = await DriverService.findById(userId);
                if (!driver) {
                    driver = await DriverService.findByEmail(userEmail);
                }
            } else if (updatedUser.tipo === 'passageiro') {
                passenger = await PassengerService.findById(userId);
                if (!passenger) {
                    passenger = await PassengerService.findByEmail(userEmail);
                }
            }

            res.render('profile-edit', { 
                title: 'Editar Perfil', 
                user: updatedUser,
                driver,
                passenger,
                error: null, 
                success: 'Perfil atualizado com sucesso!' 
            });
        } catch (error) {
            console.error('Erro ao editar perfil:', error);
            const user = await UserService.findById(req.user.id);
            let driver = null;
            let passenger = null;
            
            if (user.tipo === 'motorista') {
                driver = await DriverService.findById(req.user.id);
                if (!driver) {
                    driver = await DriverService.findByEmail(req.user.email || req.user.login);
                }
            } else if (user.tipo === 'passageiro') {
                passenger = await PassengerService.findById(req.user.id);
                if (!passenger) {
                    passenger = await PassengerService.findByEmail(req.user.email || req.user.login);
                }
            }
            
            res.render('profile-edit', { 
                title: 'Editar Perfil', 
                user,
                driver,
                passenger,
                error: 'Erro ao atualizar perfil: ' + error.message, 
                success: null 
            });
        }
    }

    static async deleteProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await UserService.findById(userId);
            
            if (user.tipo === 'motorista') {
                await DriverService.delete(userId);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.delete(userId);
            }
            
            await UserService.delete(userId);
            
            res.clearCookie('token');
            res.redirect('/login?success=Conta deletada com sucesso');
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
            res.redirect('/profile?error=Erro ao deletar conta');
        }
    }
}

export default WebProfileController;