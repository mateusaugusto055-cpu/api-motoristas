import UserService from '../services/user.service.js';
import DriverService from '../services/driver.service.js';
import PassengerService from '../services/passenger.service.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025';

class WebAuthController {
    // Página de login
    static async loginPage(req, res) {
        res.render('login', { title: 'Login', error: null, success: null });
    }

    // Processar login
    static async login(req, res) {
        try {
            const { login, senha } = req.body;
            
            const user = await UserService.findByLogin(login);
            if (!user) {
                return res.render('login', { 
                    title: 'Login', 
                    error: 'Usuário não encontrado', 
                    success: null 
                });
            }

            const senhaValida = await user.comparePassword(senha);
            if (!senhaValida) {
                return res.render('login', { 
                    title: 'Login', 
                    error: 'Senha inválida', 
                    success: null 
                });
            }

            // Gerar token JWT
            const token = jwt.sign(
                { id: user._id, login: user.login, role: user.role, tipo: user.tipo },
                SECRET_KEY,
                { expiresIn: '8h' }
            );

            // Salvar na sessão (cookie)
            res.cookie('token', token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
            res.redirect('/profile');
        } catch (error) {
            res.render('login', { 
                title: 'Login', 
                error: 'Erro ao fazer login', 
                success: null 
            });
        }
    }

    // Página de cadastro
    static async registerPage(req, res) {
        res.render('register', { title: 'Cadastro', error: null, success: null });
    }

    // Processar cadastro
    static async register(req, res) {
        try {
            const { nome, email, login, senha, tipo } = req.body;

            // Verificar se login já existe
            const existingUser = await UserService.findByLogin(login);
            if (existingUser) {
                return res.render('register', { 
                    title: 'Cadastro', 
                    error: 'Login já existe. Escolha outro.', 
                    success: null 
                });
            }

            // Criar usuário
            const user = await UserService.create({
                nome,
                email,
                login,
                senha,
                tipo,
                status: 'ativo'
            });

            // Criar perfil correspondente (motorista ou passageiro)
            if (tipo === 'motorista') {
                await DriverService.create({
                    id: user._id,
                    nome: user.nome,
                    email: user.email,
                    telefone: '',
                    cpf: '',
                    cnh: '',
                    placa: '',
                    modelo: '',
                    status: 'ativo'
                });
            } else if (tipo === 'passageiro') {
                await PassengerService.create({
                    id: user._id,
                    nome: user.nome,
                    email: user.email,
                    telefone: '',
                    endereco: '',
                    status: 'ativo'
                });
            }

            res.render('login', { 
                title: 'Login', 
                error: null, 
                success: 'Cadastro realizado com sucesso! Faça login.' 
            });
        } catch (error) {
            res.render('register', { 
                title: 'Cadastro', 
                error: 'Erro ao cadastrar usuário', 
                success: null 
            });
        }
    }

    // Logout
    static async logout(req, res) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}

export default WebAuthController;