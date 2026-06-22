import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';

class WebProfileController {
    static async profilePage(req, res) {
        try {
            const userId = req.user.id;
            
            console.log('🔍 ID do usuário:', userId);

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
            
            // ✅ BUSCAR PELO usuarioId (REFERÊNCIA)
            if (user.tipo === 'motorista') {
                driver = await DriverService.findByUsuarioId(userId);
                console.log('🔍 Motorista encontrado:', driver ? 'SIM' : 'NÃO');
            } else if (user.tipo === 'passageiro') {
                passenger = await PassengerService.findByUsuarioId(userId);
                console.log('🔍 Passageiro encontrado:', passenger ? 'SIM' : 'NÃO');
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
            const user = await UserService.findById(userId);
            let driver = null;
            let passenger = null;
            
            if (user && user.tipo === 'motorista') {
                driver = await DriverService.findByUsuarioId(userId);
            } else if (user && user.tipo === 'passageiro') {
                passenger = await PassengerService.findByUsuarioId(userId);
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
                
                await DriverService.updateByUsuarioId(userId, driverUpdate);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.updateByUsuarioId(userId, { nome, email });
            }

            const updatedUser = await UserService.findById(userId);
            let driver = null;
            let passenger = null;
            
            if (updatedUser.tipo === 'motorista') {
                driver = await DriverService.findByUsuarioId(userId);
            } else if (updatedUser.tipo === 'passageiro') {
                passenger = await PassengerService.findByUsuarioId(userId);
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
            res.redirect('/profile');
        }
    }

    static async deleteProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await UserService.findById(userId);
            
            if (user.tipo === 'motorista') {
                await DriverService.deleteByUsuarioId(userId);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.deleteByUsuarioId(userId);
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