import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';

class WebProfileController {
    // Ver perfil
    static async profilePage(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            res.render('profile', { title: 'Meu Perfil', user, error: null, success: null });
        } catch (error) {
            res.render('profile', { title: 'Meu Perfil', user: req.user, error: 'Erro ao carregar perfil', success: null });
        }
    }

    // Editar perfil - página
    static async editProfilePage(req, res) {
        try {
            const user = await UserService.findById(req.user.id);
            res.render('profile-edit', { title: 'Editar Perfil', user, error: null, success: null });
        } catch (error) {
            res.redirect('/profile');
        }
    }

    // Editar perfil - processar
    static async editProfile(req, res) {
        try {
            const { nome, email, senha } = req.body;
            const updateData = { nome, email };
            
            if (senha && senha.length >= 6) {
                const bcrypt = await import('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                updateData.senha = await bcrypt.hash(senha, salt);
            }

            await UserService.update(req.user.id, updateData);
            
            // Atualizar também o perfil correspondente
            const user = await UserService.findById(req.user.id);
            if (user.tipo === 'motorista') {
                await DriverService.update(req.user.id, { nome, email });
            } else if (user.tipo === 'passageiro') {
                await PassengerService.update(req.user.id, { nome, email });
            }

            const updatedUser = await UserService.findById(req.user.id);
            res.render('profile-edit', { 
                title: 'Editar Perfil', 
                user: updatedUser, 
                error: null, 
                success: 'Perfil atualizado com sucesso!' 
            });
        } catch (error) {
            const user = await UserService.findById(req.user.id);
            res.render('profile-edit', { 
                title: 'Editar Perfil', 
                user, 
                error: 'Erro ao atualizar perfil', 
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
            res.redirect('/profile?error=Erro ao deletar conta');
        }
    }
}

export default WebProfileController;