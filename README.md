# TaskFlow API

API REST con Express 5, TypeScript 6, Prisma 7 y PostgreSQL.

## Requisitos

- Node.js 22
- PostgreSQL 18
- npm

## Instalación

```bash
git clone https://github.com/poncibonilla79/taskflow-api
cd taskflow-api
npm install
npx prisma migrate dev
```

## Configuración

Copiar `.env.example` a `.env` y ajustar las variables:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_db
NODE_ENV=development
```

## Uso

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar a JavaScript
npm run build

# Producción (requiere build primero)
npm start
```

## Endpoints

| Método | Ruta                | Descripción                          |
|--------|---------------------|--------------------------------------|
| GET    | `/`                 | Información del proyecto             |
| GET    | `/health`           | Health check (servidor + base de datos) |
| GET    | `/api-docs`         | Documentación Swagger UI             |
| GET    | `/api/users`        | Listar usuarios                      |
| GET    | `/api/users/:id`    | Obtener usuario por ID               |
| POST   | `/api/users`        | Crear usuario                        |
| PUT    | `/api/users/:id`    | Actualizar usuario                   |
| DELETE | `/api/users/:id`    | Eliminar usuario                     |
| GET    | `/api/projects`     | Listar proyectos                     |
| GET    | `/api/projects/:id` | Obtener proyecto por ID              |
| POST   | `/api/projects`     | Crear proyecto                       |
| PUT    | `/api/projects/:id` | Actualizar proyecto                  |
| DELETE | `/api/projects/:id` | Eliminar proyecto                    |

## Tecnologías

- **Runtime**: Node.js + TypeScript 6 (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 7 + PostgreSQL
- **Documentación**: swagger-jsdoc + swagger-ui-express (OpenAPI 3.0)
- **Dev**: ts-node-dev con recarga automática

## Estructura

```
src/
├── config/
│   ├── prisma.ts     # Cliente Prisma singleton
│   ├── database.ts   # Pool PostgreSQL (legacy)
│   └── swagger.ts    # Configuración OpenAPI
├── controllers/
│   ├── users.controller.ts
│   └── projects.controller.ts
├── routes/
│   ├── health.ts
│   ├── users.ts
│   └── projects.ts
├── services/
│   ├── users.service.ts
│   └── projects.service.ts
├── types/
│   ├── user.types.ts
│   └── project.types.ts
└── index.ts          # Entrypoint
```

## Modelos de datos

- **User** — id (UUID), name, email (único), password_hash, created_at
- **Project** — id (UUID), name, description (opcional), owner_id (FK → User), created_at
- **Task** — id (UUID), title, description, status (TODO | IN_PROGRESS | DONE | CANCELLED), project_id (FK → Project), assigned_to (FK → User), created_at
- **Comment** — id (UUID), content, task_id (FK → Task), user_id (FK → User), created_at
