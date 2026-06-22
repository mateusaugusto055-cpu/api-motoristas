import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import webAuthRoutes from './routes/webAuthRoutes.js';
import webProfileRoutes from './routes/webProfileRoutes.js';
import webAdminRoutes from './routes/webAdminRoutes.js';
import webRoutes from './routes/webRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { setUserMiddleware } from './middlewares/user.middleware.js';
import rideRoutes from './routes/rideRoutes.js';
import webRideRoutes from './routes/webRideRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- IGNORAR FAVICON ---
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --- CONFIGURAÇÃO DO PUG ---
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// --- SERVIR ARQUIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, '../public')));

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware para capturar mensagens da URL
app.use((req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const success = url.searchParams.get('success');
    const error = url.searchParams.get('error');
    
    if (success) {
        req.flash = { success };
    }
    if (error) {
        req.flash = { error };
    }
    next();
});

// --- CONEXÃO COM MONGODB ---
await connectDB();

// --- MIDDLEWARE PARA DISPONIBILIZAR USUÁRIO NAS VIEWS ---
app.use(setUserMiddleware);

// --- SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================================
// ⚠️ ROTAS WEB - CADA UMA EM SEU PRÓPRIO PREFIXO
// ============================================================

// Rotas de autenticação (login, register, logout)
app.use('/', webAuthRoutes);

// Rotas de perfil (/profile, /profile/edit, /profile/delete)
app.use('/', webProfileRoutes);

// ✅ Rotas de ADMIN (prefixo /admin)
app.use('/admin', webAdminRoutes);  // ← AGORA SEPARADO!

// Rotas de visualização pública (/drivers-view, /passengers-view)
app.use('/', webRoutes);

// ✅ Rotas de CORRIDA (prefixo /rides)
app.use('/', webRideRoutes);  // ← AGORA SEPARADO!

// ============================================================
// ⚠️ ROTAS DA API (JSON)
// ============================================================

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/drivers', authMiddleware, driverRoutes);
app.use('/passengers', authMiddleware, passengerRoutes);
app.use('/rides', authMiddleware, rideRoutes);

// --- 404 ---
app.use((req, res) => {
    if (req.path.startsWith('/drivers') || req.path.startsWith('/passengers') || req.path.startsWith('/users') || req.path.startsWith('/rides')) {
        return res.status(404).json({ success: false, message: 'Rota não encontrada' });
    }
    res.status(404).render('404', { title: 'Página não encontrada' });
});

// --- MIDDLEWARE DE ERRO GLOBAL ---
app.use(errorHandler);

export default app;
