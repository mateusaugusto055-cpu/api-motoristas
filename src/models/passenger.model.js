import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
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
        required: [true, 'O telefone é obrigatório'], // ← TORNADO OBRIGATÓRIO
        trim: true,
        match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato inválido. Use (11) 99999-9999']
    },
    endereco: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    }
}, {
    timestamps: true
});

export default mongoose.model('Passenger', passengerSchema);