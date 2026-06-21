import { JSONFilePreset } from 'lowdb/node';

const defaultData = {
    drivers: [
        { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999", cpf: "123.456.789-00", cnh: "12345678901", placa: "ABC-1234", modelo: "Fiat Argo", status: "ativo" },
        { id: 2, nome: "Carlos Souza", email: "carlos@email.com", telefone: "(11) 77777-7777", cpf: "987.654.321-00", cnh: "98765432101", placa: "XYZ-5678", modelo: "Chevrolet Onix", status: "ativo" },
        { id: 3, nome: "Ana Paula", email: "ana@email.com", telefone: "(11) 66666-6666", cpf: "456.789.123-00", cnh: "45678912301", placa: "LMN-9012", modelo: "Hyundai HB20", status: "ativo" }
    ],
    passengers: [
        { id: 1, nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 88888-8888", endereco: "Av. Paulista, 1000", status: "ativo" },
        { id: 2, nome: "Pedro Oliveira", email: "pedro@email.com", telefone: "(11) 55555-5555", endereco: "Rua Augusta, 500", status: "ativo" },
        { id: 3, nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(11) 44444-4444", endereco: "Av. Brasil, 2000", status: "ativo" }
    ],
    users: [
        {
            id: 1,
            nome: "Administrador",
            email: "admin@motoristas.com",
            login: "admin",
            senha: "$2b$10$957PvZ5NzrHmoMl5rVFvIe/.n6k3CM5dYbtEAW3.xZbCUgjc9S/oe",
            role: "admin"
        },
        {
            id: 2,
            nome: "João Silva",
            email: "joao@email.com",
            login: "joao.silva",
            senha: "$2b$10$Vjrb8B6PmfNmDY5BNTg8nuQcz5DAAobvV0cd8l/OQ7oVSS6Bu05VO",
            role: "motorista"
        }
    ]
};

const db = await JSONFilePreset('db.json', defaultData);

export default db;
