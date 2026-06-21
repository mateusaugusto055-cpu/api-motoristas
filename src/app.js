import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import webRoutes from './routes/webRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- CONECTAR AO MONGODB ---
await connectDB();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROTAS
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/drivers', authMiddleware, driverRoutes);
app.use('/passengers', authMiddleware, passengerRoutes);
app.use('/', webRoutes);

// 404
app.use((req, res) => {
    if (req.path.startsWith('/drivers') || req.path.startsWith('/passengers') || req.path.startsWith('/users')) {
        return res.status(404).json({
            success: false,
            message: 'Rota não encontrada'
        });
    }
    res.status(404).render('drivers', {
        title: 'Página não encontrada',
        error: '404 - Página não encontrada'
    });
});

app.use(errorHandler);

export default app;
