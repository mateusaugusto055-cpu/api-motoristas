import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        minlength: [3, 'O nome deve ter pelo menos 3 caracteres'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    telefone: {
        type: String,
        required: [true, 'O telefone é obrigatório'],
        trim: true
    },
    cpf: {
        type: String,
        required: [true, 'O CPF é obrigatório'],
        unique: true,
        trim: true
    },
    cnh: {
        type: String,
        required: [true, 'A CNH é obrigatória'],
        unique: true,
        trim: true
    },
    placa: {
        type: String,
        required: [true, 'A placa é obrigatória'],
        uppercase: true,
        trim: true
    },
    modelo: {
        type: String,
        required: [true, 'O modelo é obrigatório'],
        trim: true
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'bloqueado'],
        default: 'ativo'
    }
}, {
    timestamps: true // Cria createdAt e updatedAt automaticamente
});

export default mongoose.model('Driver', driverSchema);