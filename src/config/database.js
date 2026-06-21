import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: 'motoristas'
        });
        console.log('✅ Conectado ao MongoDB Atlas com Mongoose!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!mongoose.connection.db) {
        throw new Error('Banco de dados não conectado. Chame connectDB() primeiro.');
    }
    return mongoose.connection.db;
};

export const closeDB = async () => {
    await mongoose.disconnect();
    console.log('🔌 Conexão com MongoDB fechada.');
};