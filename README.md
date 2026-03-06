# AccuRx - Sistema de Citas Médicas

> **MVP** - Producto Mínimo Viable API de gestión de cita médica con frontend integrado.

Este producto es un API que busa cetralizar y digitalizar todo el proceso del cuidado médico desde la agenda de una cita médica, hasta el diagnóstico, tratamiento y seguimiento del paciente.

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar configuración
cp .env.example .env

# 3. Levantar PostgreSQL
npm run db:up 

# 4. Correr migraciones para crear las tablas
npm run db:migrate:up

# 5. Iniciar servidor
npm run dev

# 6. Iniciar Vite (en otra terminal)
cd frontend 
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

## Migraciones de Base de Datos

Este proyecto utiliza `node-pg-migrate` para gestionar el esquema de la base de datos. Las migraciones se encuentran en la carpeta `migrations/`.

- **Crear una nueva migración**:
  ```bash
  npm run db:migrate -- create --name nombre-descriptivo-de-la-migracion
  ```
- **Aplicar todas las migraciones pendientes**:
  ```bash
  npm run db:migrate:up
  ```
- **Revertir la última migración aplicada**:
  ```bash
  npm run db:migrate:down
  ```

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
| `npm run db:up` | Iniciar BD |
| `npm run db:down` | Detener BD |
| `npm run dev:all` | Iniciar BD y backend |
| `npm run db:migrate:create -- --name <nombre>` | Crear una nueva migración |
| `npm run db:migrate:up` | Aplicar migraciones pendientes |
| `npm run db:migrate:down` | Revertir la última migración |
| `npm run lint` | Linter |

### Vite
Crear el archivo .env en la carpeta frontend a partir del archivo .env.example
```bash
cd frontend
cp .env.example .env
``` 
cd frontend
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |

## Despliegue en Render
URL: https://accurx.onrender.com

Lo primero que debes hacer es registrarte como paciente.

## Presentación del proyecto
http://bit.ly/46H2ueW

## Roles

- **ADMIN**: Crear médicos, ver todo
- **DOCTOR**: Confirmar citas, gestionar pacientes
- **PATIENT**: Crear/cancelar sus citas
