# TaskFlow API

API REST con Express 5, TypeScript 6 y PostgreSQL.

## Requisitos

- Node.js 22.14
- PostgreSQL 18
- npm

## Instalación

```bash
git clone https://github.com/poncibonilla79/taskflow-api
cd taskflow-api
npm install
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

| Método | Ruta       | Descripción                          |
|--------|------------|--------------------------------------|
| GET    | `/`        | Información del proyecto             |
| GET    | `/health`  | Health check (servidor + base de datos) |

## Tecnologías

- **Runtime**: Node.js + TypeScript 6
- **Framework**: Express 5
- **Base de datos**: PostgreSQL con `pg` (node-postgres)
- **Dev**: `ts-node-dev` con recarga automática

## Estructura

```
src/
├── config/
│   └── database.ts    # Pool de conexión PostgreSQL
├── routes/
│   └── health.ts      # Endpoint de health check
└── index.ts           # Entrypoint de la aplicación
```
