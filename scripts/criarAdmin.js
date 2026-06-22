import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import User from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const criarAdmin = async () => {
    try {
        await connectDB();

        // Verificar se admin já existe
        const adminExistente = await User.findOne({ login: 'admin' });
        if (adminExistente) {
            console.log('✅ Admin já existe!');
            console.log('   Login: admin');
            console.log('   Senha: admin123');
            process.exit(0);
        }

        // Criar admin
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            nome: 'Administrador',
            email: 'admin@motoristas.com',
            login: 'admin',
            senha: senhaHash,
            tipo: 'admin',      // ← ADMIN como tipo separado
            status: 'ativo',
            role: 'admin'       // ← ADMIN como role
        });

        console.log('✅ Admin criado com sucesso!');
        console.log('   Login: admin');
        console.log('   Senha: admin123');
        console.log('   ID:', admin._id);
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao criar admin:', error);
        process.exit(1);
    }
};

criarAdmin();