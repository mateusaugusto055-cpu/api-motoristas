import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
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
    login: {
        type: String,
        required: [true, 'O login é obrigatório'],
        unique: true,
        trim: true
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
    },
    tipo: {
        type: String,
        enum: ['motorista', 'passageiro'],
        required: true
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
});

// MÉTODO para comparar senha
userSchema.methods.comparePassword = function(senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model('User', userSchema);