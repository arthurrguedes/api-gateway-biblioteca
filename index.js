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
            // Rotas Bibliotecário
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
            },
            '/books': {
                get: {
                    tags: ['Catálogo'],
                    summary: 'Listar todos os livros',
                    responses: { 200: { description: 'Lista de livros completa' } }
                },
                post: {
                    tags: ['Catálogo'],
                    summary: 'Adicionar novo livro',
                    requestBody: {
                        content: { 
                            'application/json': { 
                                schema: { 
                                    type: 'object', 
                                    properties: { 
                                        titulo: { type: 'string' }, 
                                        ano: { type: 'integer' },
                                        editora: { type: 'string' },
                                        isbn: { type: 'string' },
                                        edicao: { type: 'string' }
                                    } 
                                } 
                            } 
                        }
                    },
                    responses: { 201: { description: 'Livro criado' } }
                }
            },
            '/books/{id}': {
                get: {
                    tags: ['Catálogo'],
                    summary: 'Detalhes de um livro',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Dados do livro' } }
                },
                put: {
                    tags: ['Catálogo'],
                    summary: 'Atualizar dados do livro',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        content: { 
                            'application/json': { 
                                schema: { 
                                    type: 'object', 
                                    properties: { 
                                        titulo: { type: 'string' }, 
                                        ano: { type: 'integer' },
                                        editora: { type: 'string' },
                                        isbn: { type: 'string' }
                                    } 
                                } 
                            } 
                        }
                    },
                    responses: { 200: { description: 'Atualizado' } }
                },
                delete: {
                    tags: ['Catálogo'],
                    summary: 'Deletar livro',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Deletado' } }
                }
            },
            '/books/{id}/stock': {
                put: {
                    tags: ['Catálogo'],
                    summary: 'Atualizar estoque do livro',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        content: { 'application/json': { schema: { type: 'object', properties: { novaQuantidade: { type: 'integer' } } } } }
                    },
                    responses: { 200: { description: 'Estoque atualizado' } }
                }
            },
            '/reservas': {
                post: {
                    tags: ['Reservas'],
                    summary: 'Criar reserva (ou entrar na fila)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        content: { 'application/json': { schema: { type: 'object', properties: { idLivro: { type: 'integer' } } } } }
                    },
                    responses: { 
                        201: { description: 'Reserva criada ou entrou na fila' },
                        409: { description: 'Erro de disponibilidade' }
                    }
                },
                get: {
                    tags: ['Reservas'],
                    summary: 'Listar todas as reservas (Admin)',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Lista retornada' } }
                }
            },
            '/reservas/my': {
                get: {
                    tags: ['Reservas'],
                    summary: 'Minhas reservas',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Lista do usuário' } }
                }
            },
            '/reservas/{id}': {
                put: {
                    tags: ['Reservas'],
                    summary: 'Atualizar reserva',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    requestBody: {
                        content: { 'application/json': { schema: { type: 'object', properties: { statusReserva: { type: 'string' }, prazoReserva: { type: 'string' } } } } }
                    },
                    responses: { 200: { description: 'Atualizado' } }
                },
                delete: {
                    tags: ['Reservas'],
                    summary: 'Cancelar reserva',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Cancelada' } }
                }
            },
        },
        '/emprestimos': {
                get: {
                    tags: ['Empréstimos'],
                    summary: 'Listar todos os empréstimos (Admin)',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Lista retornada' } }
                },
                post: {
                    tags: ['Empréstimos'],
                    summary: 'Gerar empréstimo a partir de reserva',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        content: { 'application/json': { schema: { type: 'object', properties: { idReserva: { type: 'integer' } } } } }
                    },
                    responses: { 201: { description: 'Empréstimo criado' } }
                }
            },
            '/emprestimos/meus': {
                get: {
                    tags: ['Empréstimos'],
                    summary: 'Meus empréstimos',
                    security: [{ bearerAuth: [] }],
                    responses: { 200: { description: 'Lista do usuário' } }
                }
            },
            '/emprestimos/{id}/devolver': {
                put: {
                    tags: ['Empréstimos'],
                    summary: 'Realizar devolução do livro',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Devolvido com sucesso' } }
                }
            },
            '/emprestimos/{id}': {
                get: {
                    tags: ['Empréstimos'],
                    summary: 'Buscar empréstimo por ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Dados encontrados' } }
                },
                delete: {
                    tags: ['Empréstimos'],
                    summary: 'Apagar registro de empréstimo',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                    responses: { 200: { description: 'Apagado' } }
                }
            },
    },
    apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Definição dos Proxys
// Proxy específico para usuários
const usersProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/users/', 
    },
    onError: (err, req, res) => res.status(502).json({ error: "Erro Users Service" })
});

// Proxy específico para bibliotecários
const bibliotecariosProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/': '/bibliotecarios/', // Readiciona o prefixo
    },
    onError: (err, req, res) => res.status(502).json({ error: "Erro Users Service" })
});

const catalogProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:4002',
    changeOrigin: true,
    pathRewrite: { '^/': '/books/' }, 
    onError: (err, req, res) => res.status(502).json({ error: "Erro Catalog Service" })
});

const reservasProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:4003',
    changeOrigin: true,
    pathRewrite: { '^/': '/reservas/'}, 
    onError: (err, req, res) => res.status(502).json({ error: "Erro Reservation Service" })
});

const emprestimosProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:4004',
    changeOrigin: true,
    pathRewrite: { '^/': '/emprestimos/'},
    onError: (err, req, res) => res.status(502).json({ error: "Erro Emprestimos Service" })
});

// Aplica o proxy
app.use('/users', usersProxy);
app.use('/bibliotecarios', bibliotecariosProxy);
app.use('/books', catalogProxy);
app.use('/reservas', reservasProxy);
app.use('/emprestimos', emprestimosProxy);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API Gateway rodando! Acesse /api-docs para a documentação.');
});

app.listen(PORT, () => {
    console.log(`API Gateway rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});