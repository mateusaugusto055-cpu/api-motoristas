import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
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
        trim: true,
        default: ''
    },
    cpf: {
        type: String,
        trim: true,
        default: ''
    },
    cnh: {
        type: String,
        trim: true,
        default: ''
    },
    placa: {
        type: String,
        uppercase: true,
        trim: true,
        default: ''
    },
    modelo: {
        type: String,
        trim: true,
        default: ''
    },
    ano: {
        type: Number,
        min: 1950,
        max: new Date().getFullYear() + 1,
        default: null
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'bloqueado'],
        default: 'ativo'
    }
}, {
    timestamps: true
});

export default mongoose.model('Driver', driverSchema);