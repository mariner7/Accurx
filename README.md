# AccuRx - Sistema de Citas Médicas

> **MVP** - Producto Mínimo Viable con fines educativos y de evaluación.

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar configuración
cp .env.example .env

# 3. Levantar PostgreSQL
npm run db:up

# 4. Iniciar servidor
npm run dev
```

La API estará disponible en `http://localhost:3000`

## Configuración

Editar `.env`:

```env
DB_HOST=localhost
DB_PORT=Número de puerto
DB_USER=usuario
DB_PASSWORD=contraseña del usuario
DB_NAME=nombre de la base datos

APP_PORT=3000
NODE_ENV=development

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# Usuario admin (se crea automáticamente)
ADMIN_EMAIL=admin@accurx.com
ADMIN_PASSWORD=admin123
```

## Documentación API

- **Swagger UI**: http://localhost:3000/api-docs
- **Postman**: Importar `docs/accurx-api-postman-collection.json`

## Usuario Admin

Se crea automáticamente al iniciar. Credenciales por defecto:
- Email: `admin@accurx.com`
- Password: `admin123`

## Uso

### 1. Login (obtener token)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@accurx.com","password":"admin123"}'
```

### 2. Usar el token en headers
```bash
-H "Authorization: Bearer TU_TOKEN"
```

### Endpoints principales

| Acción | Método | Endpoint |
|--------|--------|----------|
| Registro | POST | `/auth/register` |
| Login | POST | `/auth/login` |
| Crear cita | POST | `/appointments` |
| Ver citas | GET | `/appointments` |
| Confirmar cita | POST | `/appointments/:id/confirm` |
| Cancelar cita | POST | `/appointments/:id/cancel` |
| Crear paciente | POST | `/patients` |
| Crear médico | POST | `/doctors` |

## Scripts

### Backend y PostgreSQL

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Compilar |
| `npm run start` | Producción |
| `npm run test` | Pruebas |
| `npm run db:up` | Iniciar BD |
| `npm run db:down` | Detener BD |
| `npm run lint` | Linter |

### Vite

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |

## Roles

- **ADMIN**: Crear médicos, ver todo
- **DOCTOR**: Confirmar citas, gestionar pacientes
- **PATIENT**: Crear/cancelar sus citas
