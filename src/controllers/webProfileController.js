import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';

class WebProfileController {
    // Ver perfil
    static async profilePage(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            let driver = null;
            let passenger = null;
            
            if (user.tipo === 'motorista') {
                driver = await DriverService.findById(req.user.id);
            } else if (user.tipo === 'passageiro') {
                passenger = await PassengerService.findById(req.user.id);
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
                error: 'Erro ao carregar perfil', 
                success: null 
            });
        }
    }

    // Editar perfil - página
    static async editProfilePage(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            let driver = null;
            let passenger = null;
            
            if (user.tipo === 'motorista') {
                driver = await DriverService.findById(req.user.id);
            } else if (user.tipo === 'passageiro') {
                passenger = await PassengerService.findById(req.user.id);
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

    // Editar perfil - processar
    static async editProfile(req, res) {
        try {
            const { nome, email, senha, modelo, ano, placa, cnh } = req.body;
            const updateData = { nome, email };
            
            // Se uma nova senha foi fornecida, criptografar
            if (senha && senha.length >= 6) {
                const bcrypt = await import('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                updateData.senha = await bcrypt.hash(senha, salt);
            }

            // Atualizar usuário
            await UserService.update(req.user.id, updateData);
            
            // Atualizar também o perfil correspondente
            const user = await UserService.findById(req.user.id);
            
            if (user.tipo === 'motorista') {
                const driverUpdate = { nome, email };
                if (modelo) driverUpdate.modelo = modelo;
                if (ano) driverUpdate.ano = parseInt(ano);
                if (placa) driverUpdate.placa = placa.toUpperCase();
                if (cnh) driverUpdate.cnh = cnh;
                
                await DriverService.update(req.user.id, driverUpdate);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.update(req.user.id, { nome, email });
            }

            // Buscar dados atualizados
            const updatedUser = await UserService.findById(req.user.id);
            let driver = null;
            let passenger = null;
            
            if (updatedUser.tipo === 'motorista') {
                driver = await DriverService.findById(req.user.id);
            } else if (updatedUser.tipo === 'passageiro') {
                passenger = await PassengerService.findById(req.user.id);
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
            } else if (user.tipo === 'passageiro') {
                passenger = await PassengerService.findById(req.user.id);
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

    // Deletar conta
    static async deleteProfile(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            
            // Deletar perfil correspondente
            if (user.tipo === 'motorista') {
                await DriverService.delete(req.user.id);
            } else if (user.tipo === 'passageiro') {
                await PassengerService.delete(req.user.id);
            }
            
            await UserService.delete(req.user.id);
            
            res.clearCookie('token');
            res.redirect('/login?success=Conta deletada com sucesso');
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
            res.redirect('/profile?error=Erro ao deletar conta');
        }
    }
}

export default WebProfileController;