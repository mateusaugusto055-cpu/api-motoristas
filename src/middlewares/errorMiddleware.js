export const errorHandler = (error, req, res, next) => {
    console.error(`[ERRO] ${new Date().toISOString()}:`);
    console.error(`  Rota: ${req.method} ${req.url}`);
    console.error(`  Mensagem: ${error.message}`);
    
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 
        ? 'Ocorreu um erro interno no servidor' 
        : error.message;
    
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message
    });
};

export default errorHandler;