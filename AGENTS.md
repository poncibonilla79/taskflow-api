# TaskFlow API — Guía para Agentes

## Stack

- **Runtime**: Node.js 22 + TypeScript 6 (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 7 + PostgreSQL
- **Swagger**: swagger-jsdoc + swagger-ui-express
- **Validación**: Zod
- **Autenticación**: JWT (jsonwebtoken + bcryptjs)

## Convenciones de código

- **Naming**: `kebab-case` para archivos y directorios; `camelCase` para variables/funciones; sufijos `Dto` y `Public` para tipos.
- **Exports**: `default` para routers y clientes; `export const obj = { ... }` para controllers/services; `export type` para tipos.
- **Imports**: Siempre relativos, sin barrel files ni path aliases. Paquetes npm primero, luego locales.
- **Controllers**: Capturan errores con `try/catch`, usan helpers de `utils/response.util.ts`.
- **Services**: Lanzan `{ status, message }` para errores conocidos; dejan que Prisma propague los inesperados.
- **Middleware**: `authMiddleware` (JWT), `validate(schema)` (Zod), `errorMiddleware` (centralizado).
- **Respuestas**: Usar `sendSuccess`, `sendCreated`, `sendError`, `sendNoContent` desde `utils/response.util.ts`. Formato unificado: `{ status, message, data?, error?, timestamp }`.
- **Validación**: Definir esquemas Zod en `src/schemas/` y aplicar con `validate(schema)` en la ruta.
- **Autenticación**: Endpoints protegidos usan `authMiddleware`. El payload JWT queda en `req.user` (`{ userId, email }`).
- **Autorización**: Services verifican ownership del recurso y lanzan `{ status: 403, message }`.
- **Sin logging ni tests**.

## Comandos

```bash
npm run dev    # desarrollo con recarga (ts-node-dev)
npm run build  # compilar TypeScript
npm start      # producción (requiere build)
npm run seed   # poblar BD con datos de prueba
```

No hay scripts de lint ni test configurados.

## Estructura

```
src/
├── config/        # prisma.ts, swagger.ts
├── controllers/   # handlers HTTP
├── middleware/     # auth, validate, error
├── routes/        # definiciones de rutas + OpenAPI
├── schemas/       # esquemas Zod
├── services/      # lógica de negocio
├── types/         # DTOs y tipos públicos
├── utils/         # response.util.ts
└── index.ts       # entrypoint
```

## Variables de entorno

```
PORT=3000
DATABASE_URL=postgresql://...
NODE_ENV=development
JWT_SECRET=<token>
JWT_EXPIRES_IN=7d
```

## Al trabajar en el código

1. Mantener el patrón **routes → controllers → services → Prisma**.
2. Agregar tipos en `types/` y DTOs con sufijo `Dto`.
3. Agregar esquemas Zod en `schemas/` y aplicar con `validate()` en la ruta.
4. Proteger rutas con `authMiddleware` cuando requieran autenticación.
5. Documentar rutas con JSDoc `@openapi` inline.
6. Usar `prisma` desde `src/config/prisma.ts` (singleton).
7. Usar helpers de respuesta desde `utils/response.util.ts` (no `res.json()` directo).
8. No añadir comentarios a menos que se solicite explícitamente.
9. Seguir el estilo funcional/object-literal existente (sin clases).
