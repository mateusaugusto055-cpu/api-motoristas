import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
    // Passageiro que solicitou
    passageiroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Motorista que aceitou (opcional até ser aceito)
    motoristaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Detalhes da corrida
    origem: {
        type: String,
        required: [true, 'A origem é obrigatória'],
        trim: true
    },
    destino: {
        type: String,
        required: [true, 'O destino é obrigatório'],
        trim: true
    },
    distancia_km: {
        type: Number,
        default: 0
    },
    valor_estimado: {
        type: Number,
        default: 0
    },
    valor_final: {
        type: Number,
        default: 0
    },
    // Status da corrida
    status: {
        type: String,
        enum: ['solicitada', 'aceita', 'em_andamento', 'concluida', 'cancelada'],
        default: 'solicitada'
    },
    // Avaliações
    avaliacao_passageiro: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    avaliacao_motorista: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    // Timestamps
    data_solicitacao: {
        type: Date,
        default: Date.now
    },
    data_aceite: {
        type: Date,
        default: null
    },
    data_inicio: {
        type: Date,
        default: null
    },
    data_fim: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Índices para melhorar performance
rideSchema.index({ status: 1 });
rideSchema.index({ passageiroId: 1 });
rideSchema.index({ motoristaId: 1 });

export default mongoose.model('Ride', rideSchema);