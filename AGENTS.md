# TaskFlow API — Guía para Agentes

## Stack

- **Runtime**: Node.js 22 + TypeScript 6 (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 7 + PostgreSQL
- **Swagger**: swagger-jsdoc + swagger-ui-express

## Convenciones de código

- **Naming**: `kebab-case` para archivos y directorios; `camelCase` para variables/funciones; sufijos `Dto` y `Public` para tipos.
- **Exports**: `default` para routers y clientes; `export const obj = { ... }` para controllers/services; `export type` para tipos.
- **Imports**: Siempre relativos, sin barrel files ni path aliases. Paquetes npm primero, luego locales.
- **Controllers**: Capturan errores con `try/catch`, devuelven `{ data }` o `{ error }`.
- **Services**: No capturan errores, dejan que Prisma los propague.
- **Códigos Prisma**: `P2025` → 404, `P2003` → 400.
- **Respuestas**: `{ data, count }` en listas, `{ data }` en单个, `204` sin contenido.
- **Sin librerías de validación, logging, autenticación ni tests**.

## Comandos

```bash
npm run dev    # desarrollo con recarga (ts-node-dev)
npm run build  # compilar TypeScript
npm start      # producción (requiere build)
```

No hay scripts de lint ni test configurados.

## Estructura

```
src/
├── config/        # prisma.ts, swagger.ts
├── controllers/   # handlers HTTP
├── routes/        # definiciones de rutas + OpenAPI
├── services/      # lógica de negocio
├── types/         # DTOs y tipos públicos
└── index.ts       # entrypoint
```

## Al trabajar en el código

1. Mantener el patrón **routes → controllers → services → Prisma**.
2. Agregar tipos en `types/` y DTOs con sufijo `Dto`.
3. Documentar rutas con JSDoc `@openapi` inline.
4. Usar `prisma` desde `src/config/prisma.ts` (singleton).
5. No añadir comentarios a menos que se solicite explícitamente.
6. Seguir el estilo funcional/object-literal existente (sin clases).
