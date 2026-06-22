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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- IGNORAR FAVICON (SOLUÇÃO PARA O ERRO NaN) ---
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

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

await connectDB();

app.use(setUserMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- ROTAS API ---
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/drivers', authMiddleware, driverRoutes);
app.use('/passengers', authMiddleware, passengerRoutes);

// --- ROTAS WEB ---
app.use('/', webAuthRoutes);
app.use('/', webProfileRoutes);
app.use('/', webAdminRoutes);
app.use('/', webRoutes);

// --- 404 ---
app.use((req, res) => {
    if (req.path.startsWith('/drivers') || req.path.startsWith('/passengers') || req.path.startsWith('/users')) {
        return res.status(404).json({ success: false, message: 'Rota não encontrada' });
    }
    res.status(404).render('404', { title: 'Página não encontrada' });
});

app.use(errorHandler);

export default app;