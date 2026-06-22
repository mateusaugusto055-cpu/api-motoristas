import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';

class WebAdminController {
    // Painel admin
    static async adminPage(req, res) {
        try {
            const allUsers = await UserService.findAll();
            const motoristas = allUsers.filter(u => u.tipo === 'motorista');
            const passageiros = allUsers.filter(u => u.tipo === 'passageiro');
            
            const motoristasDetalhes = await Promise.all(
                motoristas.map(async (u) => {
                    const driver = await DriverService.findById(u._id);
                    return { ...u.toObject(), status: driver?.status || 'ativo' };
                })
            );
            
            const passageirosDetalhes = await Promise.all(
                passageiros.map(async (u) => {
                    const passenger = await PassengerService.findById(u._id);
                    return { ...u.toObject(), status: passenger?.status || 'ativo' };
                })
            );

            res.render('admin/users', {
                title: 'Admin - Usuários',
                motoristas: motoristasDetalhes,
                passageiros: passageirosDetalhes,
                success: null
            });
        } catch (error) {
            res.render('admin/users', {
                title: 'Admin - Usuários',
                motoristas: [],
                passageiros: [],
                success: 'Erro ao carregar usuários'
            });
        }
    }

    // Suspender usuário
    static async suspendUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            
            if (user.tipo === 'motorista') {
                await DriverService.update(id, { status: 'inativo' });
            } else if (user.tipo === 'passageiro') {
                await PassengerService.update(id, { status: 'inativo' });
            }
            
            res.redirect('/admin/users');
        } catch (error) {
            res.redirect('/admin/users');
        }
    }

    // Ativar usuário
    static async activateUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            
            if (user.tipo === 'motorista') {
                await DriverService.update(id, { status: 'ativo' });
            } else if (user.tipo === 'passageiro') {
                await PassengerService.update(id, { status: 'ativo' });
            }
            
            res.redirect('/admin/users');
        } catch (error) {
            res.redirect('/admin/users');
        }
    }

    // Deletar usuário (admin)
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            
            if (user.tipo === 'motorista') {
                await DriverService.delete(id);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.delete(id);
            }
            
            await UserService.delete(id);
            res.redirect('/admin/users');
        } catch (error) {
            res.redirect('/admin/users');
        }
    }
}

export default WebAdminController;