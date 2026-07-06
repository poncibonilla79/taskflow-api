# TaskFlow API

API REST con Express 5, TypeScript 6, Prisma 7 y PostgreSQL.

## Requisitos

- Node.js 22.14
- PostgreSQL 18
- npm

## Instalación

```bash
git clone https://github.com/poncibonilla79/taskflow-api
cd taskflow-api
npm install
npx prisma migrate dev
npm run seed          # opcional: poblar BD con datos de prueba
```

## Configuración

Copiar `.env.example` a `.env` y ajustar las variables:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_db
NODE_ENV=development
JWT_SECRET=<tu-secreto>
JWT_EXPIRES_IN=7d
```

## Uso

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar a JavaScript
npm run build

# Producción (requiere build primero)
npm start

# Poblar base de datos con datos de prueba
npm run seed
```

## Endpoints

### Salud e información

| Método | Ruta          | Descripción                          |
|--------|---------------|--------------------------------------|
| GET    | `/`           | Información del proyecto             |
| GET    | `/health`     | Health check (servidor + base de datos) |
| GET    | `/api-docs`   | Documentación Swagger UI             |

### Auth

| Método | Ruta                 | Descripción             | Autenticación |
|--------|----------------------|-------------------------|:---:|
| POST   | `/api/auth/register` | Registrar nuevo usuario |  -  |
| POST   | `/api/auth/login`    | Iniciar sesión          |  -  |
| GET    | `/api/auth/me`       | Obtener usuario actual  | 🔒  |

### Usuarios

| Método | Ruta                | Descripción             | Autenticación |
|--------|---------------------|-------------------------|:---:|
| GET    | `/api/users`        | Listar usuarios         |  -  |
| GET    | `/api/users/:id`    | Obtener usuario por ID  |  -  |
| POST   | `/api/users`        | Crear usuario           |  -  |
| PUT    | `/api/users/:id`    | Actualizar usuario      |  -  |
| DELETE | `/api/users/:id`    | Eliminar usuario        |  -  |

### Proyectos

| Método | Ruta                   | Descripción               | Autenticación |
|--------|------------------------|---------------------------|:---:|
| GET    | `/api/projects`        | Listar proyectos          |  -  |
| GET    | `/api/projects/:id`    | Obtener proyecto por ID   |  -  |
| POST   | `/api/projects`        | Crear proyecto            |  -  |
| PUT    | `/api/projects/:id`    | Actualizar proyecto       |  -  |
| DELETE | `/api/projects/:id`    | Eliminar proyecto         |  -  |

### Tareas

| Método | Ruta                          | Descripción               | Autenticación |
|--------|-------------------------------|---------------------------|:---:|
| GET    | `/api/tasks/project/:projectId` | Listar tareas por proyecto | 🔒  |
| GET    | `/api/tasks/:id`              | Obtener tarea por ID      | 🔒  |
| POST   | `/api/tasks`                  | Crear tarea               | 🔒  |
| PUT    | `/api/tasks/:id`              | Actualizar tarea          | 🔒  |
| DELETE | `/api/tasks/:id`              | Eliminar tarea            | 🔒  |

### Comentarios

| Método | Ruta                          | Descripción                  | Autenticación |
|--------|-------------------------------|------------------------------|:---:|
| GET    | `/api/comments/task/:taskId`  | Listar comentarios de tarea  | 🔒  |
| POST   | `/api/comments`               | Crear comentario             | 🔒  |
| DELETE | `/api/comments/:id`           | Eliminar comentario          | 🔒  |

> 🔒 = Requiere token JWT (header `Authorization: Bearer <token>`)

## Tecnologías

- **Runtime**: Node.js + TypeScript 6 (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 7 + PostgreSQL
- **Validación**: Zod
- **Autenticación**: JWT + bcryptjs
- **Documentación**: swagger-jsdoc + swagger-ui-express (OpenAPI 3.0)
- **Dev**: ts-node-dev con recarga automática

## Estructura

```
src/
├── config/
│   ├── prisma.ts       # Cliente Prisma singleton
│   ├── database.ts     # Pool PostgreSQL (legacy)
│   └── swagger.ts      # Configuración OpenAPI
├── controllers/
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   ├── projects.controller.ts
│   ├── tasks.controller.ts
│   └── comments.controller.ts
├── middleware/
│   ├── auth.middleware.ts    # JWT authentication
│   ├── error.middleware.ts   # Error handler centralizado
│   └── validate.middleware.ts # Validación Zod
├── routes/
│   ├── health.ts
│   ├── auth.ts
│   ├── users.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── comments.ts
├── schemas/
│   ├── auth.schemas.ts      # Esquemas Zod para auth
│   └── task.schemas.ts      # Esquemas Zod para tareas
├── services/
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── projects.service.ts
│   ├── tasks.service.ts
│   └── comments.service.ts
├── types/
│   ├── api-response.types.ts
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── project.types.ts
│   ├── task.types.ts
│   └── comment.types.ts
├── utils/
│   └── response.util.ts     # Helpers de respuesta unificados
└── index.ts                 # Entrypoint
```

## Modelos de datos

- **User** — id (UUID), name, email (único), password_hash, created_at
- **Project** — id (UUID), name, description (opcional), owner_id (FK → User), created_at
- **Task** — id (UUID), title, description, status (TODO | IN_PROGRESS | DONE | CANCELLED), project_id (FK → Project), assigned_to (FK → User), created_at
- **Comment** — id (UUID), content, task_id (FK → Task), user_id (FK → User), created_at
