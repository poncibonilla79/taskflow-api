import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gestión de tareas tipo Kanban',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Ana López' },
            email: { type: 'string', format: 'email', example: 'ana@taskflow.com' },
            password: { type: 'string', format: 'password', example: 'mipassword' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'ana@taskflow.com' },
            password: { type: 'string', format: 'password', example: 'mipassword' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@email.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Implementar login' },
            description: { type: 'string', nullable: true, example: 'Crear el endpoint de autenticación' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
            projectId: { type: 'string', format: 'uuid' },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            title: { type: 'string', example: 'Implementar login' },
            description: { type: 'string', example: 'Crear el endpoint de autenticación' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
            projectId: { type: 'string', format: 'uuid' },
            assignedTo: { type: 'string', format: 'uuid' },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Implementar login' },
            description: { type: 'string', example: 'Crear el endpoint de autenticación' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Mi Proyecto' },
            description: { type: 'string', nullable: true, example: 'Descripción del proyecto' },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
