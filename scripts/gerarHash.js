import bcrypt from 'bcryptjs';

async function gerarHash() {
    const senhaAdmin = 'admin123';
    const senhaMotorista = '123456';
    
    const salt = await bcrypt.genSalt(10);
    const hashAdmin = await bcrypt.hash(senhaAdmin, salt);
    const hashMotorista = await bcrypt.hash(senhaMotorista, salt);
    
    console.log('=' .repeat(50));
    console.log('🔑 HASHES PARA USAR NO db.json:');
    console.log('=' .repeat(50));
    console.log('');
    console.log(`Usuário: admin | Senha: ${senhaAdmin}`);
    console.log(`Hash: ${hashAdmin}`);
    console.log('');
    console.log(`Usuário: joao.silva | Senha: ${senhaMotorista}`);
    console.log(`Hash: ${hashMotorista}`);
    console.log('');
    console.log('=' .repeat(50));
}

gerarHash();