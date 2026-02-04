# Identity API

Projeto de estudo para praticar autenticacao, autorizacao por permissoes e organizacao de use cases.

## Objetivo
- Demonstrar fluxo de login + refresh token
- Proteger rotas com JWT
- Controlar acesso por permissoes (RBAC)
- Servir como base para aprendizado e testes

## Stack
- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- Zod (validacao)

## Como rodar (ambiente local)
1) Instale dependencias
```bash
npm install
```
2) Configure o `.env`
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/identity_api?schema=public"
JWT_SECRET="..."
REFRESH_TOKEN_SECRET="..."
JWT_EXPIRES_IN="15m"
```
3) (Opcional) Rode migrations/seed
```bash
npx prisma migrate dev
npx prisma db seed
```
4) Inicie o servidor
```bash
npm run dev
```

Base URL padrao: `http://localhost:3000`

## Autenticacao
- Envie `Authorization: Bearer {{accessToken}}` nas rotas protegidas.
- `POST /auth/login` retorna `accessToken` e `refreshToken`.
- `POST /auth/refresh` recebe `refreshToken` e retorna novo `accessToken`.

Se rodar o seed, existe um usuario de teste:
- email: `user@test.com`
- password: `password`

## Colecao do Postman
Importe o arquivo `identity-api.postman_collection.json`.

Variaveis usadas:
- `baseUrl` (ex: `http://localhost:3000`)
- `accessToken`
- `refreshToken`
- `userId`
- `roleId`
- `permissionId`

## Rotas

### Health
- `GET /health` (publica)
  - Resposta: `{ "status": "ok" }`

### Auth
- `POST /auth/login` (publica)
  - Body:
```json
{ "email": "user@test.com", "password": "password" }
```
- `POST /auth/refresh` (publica)
  - Body:
```json
{ "refreshToken": "{{refreshToken}}" }
```

### Users
- `POST /users` (protegida, permissao: `user:create`)
  - Body:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "123456" }
```
- `POST /users/:user_id/sync-roles` (protegida, permissao: `role:assign`)
  - Body:
```json
{ "roles_ids": ["{{roleId}}"] }
```

### Roles
- `GET /roles` (protegida, permissao: `role:read`)
- `GET /roles/permissions?role_id=:id` (protegida, permissao: `role:read`)
- `POST /roles` (protegida, permissao: `role:create`)
  - Body:
```json
{ "name": "admin", "description": "Full access" }
```
- `PUT /roles/:role_id` (protegida, permissao: `role:update`)
  - Body:
```json
{ "name": "manager", "description": "Limited access" }
```
- `DELETE /roles/:role_id` (protegida, permissao: `role:delete`)
- `POST /roles/:role_id/sync-permissions` (protegida, permissao: `role:sync_permissions`)
  - Body:
```json
{ "permissions_ids": ["{{permissionId}}"] }
```

### Permissions
- `GET /permissions` (protegida, permissao: `permission:read`)

## Observacoes
- Este repositorio e **exclusivamente para aprendizado**.
- Endpoints e regras podem mudar sem aviso.
