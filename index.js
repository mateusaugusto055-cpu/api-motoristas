import app from './src/app.js';

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`🚗 API Motoristas online na porta ${PORTA}`);
    console.log(`📍 API JSON:`);
    console.log(`   GET    http://localhost:${PORTA}/drivers`);
    console.log(`   GET    http://localhost:${PORTA}/passengers`);
    console.log(`📍 Páginas WEB:`);
    console.log(`   http://localhost:${PORTA}/drivers-view`);
    console.log(`   http://localhost:${PORTA}/passengers-view`);
});