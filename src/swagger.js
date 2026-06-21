import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Motoristas de Aplicativo',
            version: '1.0.0',
            description: `
                API para gerenciamento de motoristas e passageiros de aplicativo.
                
                ## Autenticação:
                Esta API utiliza JWT (JSON Web Token) para autenticação.
                
                1. Faça login em \`/auth/login\` com suas credenciais
                2. Copie o token retornado
                3. Adicione ao cabeçalho das requisições: \`Authorization: Bearer <token>\`
            `,
            contact: {
                name: "Suporte API",
                email: "suporte@motoristas.com"
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor de Desenvolvimento"
            }
        ],
        tags: [
            {
                name: "Autenticação",
                description: "Login e geração de token JWT"
            },
            {
                name: "Motoristas",
                description: "Operações relacionadas a motoristas (requer autenticação)"
            },
            {
                name: "Passageiros",
                description: "Operações relacionadas a passageiros (requer autenticação)"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "Administrador" },
                        email: { type: "string", example: "admin@motoristas.com" },
                        login: { type: "string", example: "admin" },
                        role: { type: "string", example: "admin" }
                    }
                },
                LoginRequest: {
                    type: "object",
                    required: ["login", "senha"],
                    properties: {
                        login: { type: "string", example: "admin" },
                        senha: { type: "string", example: "admin123" }
                    }
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                        message: { type: "string", example: "Autenticação realizada com sucesso!" }
                    }
                },
                Driver: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "João Silva" },
                        email: { type: "string", example: "joao@email.com" },
                        telefone: { type: "string", example: "(11) 99999-9999" },
                        cpf: { type: "string", example: "123.456.789-00" },
                        cnh: { type: "string", example: "12345678901" },
                        placa: { type: "string", example: "ABC-1234" },
                        modelo: { type: "string", example: "Fiat Argo" },
                        status: { type: "string", enum: ["ativo", "inativo", "bloqueado"] }
                    }
                },
                Passenger: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "Maria Santos" },
                        email: { type: "string", example: "maria@email.com" },
                        telefone: { type: "string", example: "(11) 88888-8888" },
                        endereco: { type: "string", example: "Av. Paulista, 1000" },
                        status: { type: "string", enum: ["ativo", "inativo"] }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;