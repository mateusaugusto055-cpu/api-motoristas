// src/controllers/webAdminController.js

import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';
import mongoose from 'mongoose';

class WebAdminController {
    // Painel admin
    static async adminPage(req, res) {
        try {
            const allUsers = await UserService.findAll();
            
            // Buscar todos os motoristas
            const allDrivers = await DriverService.findAll();
            const motoristas = allDrivers.map(driver => {
                const user = allUsers.find(u => u._id.toString() === driver.usuarioId?.toString());
                return {
                    ...driver.toObject(),
                    nome: user?.nome || driver.nome,
                    email: user?.email || driver.email
                };
            });

            // Buscar todos os passageiros
            const allPassengers = await PassengerService.findAll();
            const passageiros = allPassengers.map(passenger => {
                const user = allUsers.find(u => u._id.toString() === passenger.usuarioId?.toString());
                return {
                    ...passenger.toObject(),
                    nome: user?.nome || passenger.nome,
                    email: user?.email || passenger.email
                };
            });

            res.render('admin/users', {
                title: 'Admin - Usuários',
                motoristas,
                passageiros,
                success: null,
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar admin:', error);
            res.render('admin/users', {
                title: 'Admin - Usuários',
                motoristas: [],
                passageiros: [],
                success: null,
                error: 'Erro ao carregar usuários'
            });
        }
    }

    // ✅ EXCLUIR MOTORISTA
    static async deleteDriver(req, res) {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.redirect('/admin/users?error=ID inválido');
            }

            // Buscar o motorista
            const driver = await DriverService.findById(id);
            if (!driver) {
                return res.redirect('/admin/users?error=Motorista não encontrado');
            }

            // Deletar o motorista
            await DriverService.delete(id);

            // Se tiver usuarioId, deletar o usuário também
            if (driver.usuarioId) {
                await UserService.delete(driver.usuarioId);
            }

            res.redirect('/admin/users?success=Motorista excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir motorista:', error);
            res.redirect('/admin/users?error=Erro ao excluir motorista');
        }
    }

    // ✅ EXCLUIR PASSAGEIRO
    static async deletePassenger(req, res) {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.redirect('/admin/users?error=ID inválido');
            }

            // Buscar o passageiro
            const passenger = await PassengerService.findById(id);
            if (!passenger) {
                return res.redirect('/admin/users?error=Passageiro não encontrado');
            }

            // Deletar o passageiro
            await PassengerService.delete(id);

            // Se tiver usuarioId, deletar o usuário também
            if (passenger.usuarioId) {
                await UserService.delete(passenger.usuarioId);
            }

            res.redirect('/admin/users?success=Passageiro excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir passageiro:', error);
            res.redirect('/admin/users?error=Erro ao excluir passageiro');
        }
    }
}

export default WebAdminController;