const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração de CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Biblioteca+ API Gateway',
            version: '1.0.0',
            description: 'Documentação centralizada da API da Biblioteca+',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'API Gateway'
            }
        ],
        components: {
            securitySchemes: {
                // Para implementar JWT
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        paths: {
            '/users/login': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Login de usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' },
                                        senha: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login realizado com sucesso' },
                        401: { description: 'Credenciais inválidas' }
                    }
                }
            },
            '/users/register': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Cadastrar novo usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string' },
                                        email: { type: 'string' },
                                        senha: { type: 'string' },
                                        dataNascimento: { type: 'string', format: 'date' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Criado com sucesso' }
                    }
                }
            },
            '/users': {
                get: {
                    tags: ['Usuários'],
                    summary: 'Listar todos os usuários',
                    responses: { 200: { description: 'Lista de usuários' } }
                }
            },
            '/users/{id}': {
                get: {
                    tags: ['Usuários'],
                    summary: 'Buscar usuário por ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Dados do usuário' } }
                },
                put: {
                    tags: ['Usuários'],
                    summary: 'Atualizar usuário',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string' },
                                        email: { type: 'string' },
                                        senha: { type: 'string' },
                                        dataNascimento: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Atualizado com sucesso' } }
                },
                delete: {
                    tags: ['Usuários'],
                    summary: 'Deletar usuário',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Deletado com sucesso' } }
                }
            },
            // --- ROTAS DE BIBLIOTECÁRIOS ---
            '/bibliotecarios/login': {
                post: {
                    tags: ['Bibliotecários'],
                    summary: 'Login de bibliotecário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        login: { type: 'string' },
                                        senha: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Sucesso' } }
                }
            },
            '/bibliotecarios/register': {
                post: {
                    tags: ['Bibliotecários'],
                    summary: 'Cadastrar novo bibliotecário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string', example: 'Carlos Bibliotecário' },
                                        login: { type: 'string', example: 'carlos.biblio' },
                                        senha: { type: 'string', example: 'senhaForte123' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 
                        201: { description: 'Bibliotecário criado' },
                        409: { description: 'Login já existe' }
                    }
                }
            },
            '/bibliotecarios': {
                get: {
                    tags: ['Bibliotecários'],
                    summary: 'Listar bibliotecários',
                    responses: { 200: { description: 'Lista de bibliotecários' } }
                }
            },
            '/bibliotecarios/{id}': {
                get: {
                    tags: ['Bibliotecários'],
                    summary: 'Buscar bibliotecário por ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 
                        200: { description: 'Dados encontrados' },
                        404: { description: 'Não encontrado' }
                    }
                },
                put: {
                    tags: ['Bibliotecários'],
                    summary: 'Atualizar dados do bibliotecário',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string' },
                                        login: { type: 'string' },
                                        senha: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: { 200: { description: 'Atualizado com sucesso' } }
                },
                delete: {
                    tags: ['Bibliotecários'],
                    summary: 'Remover um bibliotecário',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Removido com sucesso' } }
                }
            }
        }
    },
    apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Definição dos Proxys
// Proxy específico para Usuários
const usersProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/users/', 
    },
    onError: (err, req, res) => res.status(502).json({ error: "Erro Users Service" })
});

// Proxy específico para Bibliotecários
const bibliotecariosProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/bibliotecarios/', // Readiciona o prefixo
    },
    onError: (err, req, res) => res.status(502).json({ error: "Erro Users Service" })
});

// Aplica o proxy
app.use('/users', usersProxy);
app.use('/bibliotecarios', bibliotecariosProxy);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API Gateway rodando! Acesse /api-docs para a documentação.');
});

app.listen(PORT, () => {
    console.log(`API Gateway rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});