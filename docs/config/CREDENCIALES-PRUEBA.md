# Credenciales de Prueba - Mi Ganado

## Usuario Administrador

Para probar el módulo de titulares, usa las siguientes credenciales:

**Email:** `admin@miganado.cl`  
**Contraseña:** `admin123`

**Rol:** ADMIN

## Configuración del Sistema

### Backend
- **URL:** http://localhost:8089
- **Base de datos:** PostgreSQL en Docker (puerto 5433)
- **Estado:** ✅ Corriendo

### Frontend
- **URL:** http://localhost:3000
- **Variables de entorno configuradas:**
  - `API_URL=http://localhost:8089`
  - `NEXT_PUBLIC_API_URL=http://localhost:8089`

## Endpoints Disponibles

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil del usuario

### Titulares
- `GET /api/v1/ganado/titulares` - Listar titulares
- `POST /api/v1/ganado/titulares` - Crear titular
- `GET /api/v1/ganado/titulares/:id` - Obtener titular
- `PATCH /api/v1/ganado/titulares/:id` - Actualizar titular
- `DELETE /api/v1/ganado/titulares/:id` - Eliminar titular
- `PATCH /api/v1/ganado/titulares/:id/toggle-estado` - Cambiar estado

## Pasos para Probar

1. **Iniciar el backend** (si no está corriendo):
   ```bash
   cd /Users/ja/Documents/GitHub/backend-agente
   npm run start:dev
   ```

2. **Iniciar el frontend**:
   ```bash
   cd /Users/ja/Documents/GitHub/mi-ganado
   npm run dev
   ```

3. **Acceder a la aplicación**:
   - Abrir http://localhost:3000
   - Iniciar sesión con las credenciales de arriba
   - Navegar a "Configuración > Titulares"

## Notas

- El backend requiere autenticación JWT para todos los endpoints de titulares
- Los usuarios con rol ADMIN o PROFESSIONAL pueden crear y editar titulares
- Los usuarios con rol PATIENT solo pueden ver titulares
