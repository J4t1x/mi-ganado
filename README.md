# Mi Ganado - Sistema de Gestión Ganadera Digital

**Versión:** 1.0.0  
**Estado:** En desarrollo activo  
**Última actualización:** 4 de Febrero 2026

## Descripción

**Mi Ganado** es una plataforma web progresiva (PWA) diseñada para la gestión integral de ganado bovino en Chile. El sistema permite a titulares de establecimientos ganaderos centralizar, trazar y gestionar eficientemente toda la información de su ganado, facilitando el cumplimiento normativo con SIPEC/SAG.

### Contexto del Proyecto

Este proyecto es parte de un ecosistema más amplio que incluye:
- **Frontend (este repo):** Aplicación Next.js para gestión ganadera
- **Backend:** `backend-agente` - API NestJS con módulo ganado
- **Base de datos:** PostgreSQL con Prisma ORM
- **Infraestructura:** Railway (producción) + Docker (desarrollo)

### Características Principales

- ✅ **Gestión completa de animales** - CRUD con identificadores múltiples (DIIO, RFID, Chip, Bolus)
- ✅ **Gestión de titulares y establecimientos** - Estructura organizacional completa
- ✅ **Registro de pesajes** - Importación de datos desde equipos XR5000
- ✅ **Control de lotes** - Agrupación operativa de animales
- ✅ **Movimientos de ganado** - Traslados, ventas, compras y bajas
- ✅ **Reportes y dashboards** - Visualización de KPIs y estadísticas
- 🚧 **Modo offline** - Trabajo en terreno sin conectividad (en desarrollo)
- 🚧 **Sincronización automática** - Datos locales sincronizados con el backend (en desarrollo)

## Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3 + TailwindCSS 4
- **Componentes:** shadcn/ui + Radix UI
- **Estado:** Zustand + TanStack Query
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React

### Backend
- **API:** NestJS (backend-agente)
- **Base de datos:** PostgreSQL + Prisma ORM
- **Autenticación:** JWT + RBAC
- **Hosting:** Railway (producción)

## Requisitos Previos

- Node.js 20+ 
- npm o pnpm
- Acceso al backend `backend-agente` (local o producción)

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd mi-ganado
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8089

# API Key (REQUERIDA)
# Obtener del administrador del backend o generar una nueva
NEXT_PUBLIC_API_KEY=cdae5ecff427cf5474ff55279aa8b27a72d50cc670b72c79f362aefc6e98f2a7

# Para producción
# NEXT_PUBLIC_API_URL=https://jard.up.railway.app
```

**⚠️ IMPORTANTE:** El backend requiere una API Key válida en todas las peticiones. Sin ella, recibirás errores 401 (Unauthorized).

Para generar una nueva API Key:
```bash
cd ../backend-agente
npx ts-node scripts/create-api-key.ts <userId> "Mi Ganado Frontend" 365
```

Ver más detalles en [`/docs/ENV-CONFIG.md`](./docs/ENV-CONFIG.md)

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## Credenciales de Prueba

Para probar el sistema, usa las siguientes credenciales:

**Email:** `admin@miganado.cl`  
**Contraseña:** `admin123`  
**Rol:** ADMIN

**Nota:** Los tokens JWT expiran después de cierto tiempo. Si recibes errores 401, cierra sesión y vuelve a iniciar sesión para obtener un nuevo token.

## Estructura del Proyecto

```
mi-ganado/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── (auth)/               # Rutas de autenticación
│   │   │   └── login/
│   │   └── dashboard/            # Rutas protegidas
│   │       ├── animales/         # Gestión de animales
│   │       ├── configuracion/    # Titulares y establecimientos
│   │       ├── lotes/            # Gestión de lotes
│   │       ├── movimientos/      # Movimientos de ganado
│   │       ├── pesajes/          # Registro de pesajes
│   │       └── reportes/         # Reportes y estadísticas
│   ├── components/
│   │   ├── animales/             # Componentes de animales
│   │   ├── auth/                 # Componentes de autenticación
│   │   ├── dashboard/            # Componentes del dashboard
│   │   ├── establecimientos/     # Componentes de establecimientos
│   │   ├── titulares/            # Componentes de titulares
│   │   └── ui/                   # Componentes base (shadcn)
│   ├── lib/
│   │   ├── api/                  # Servicios de API
│   │   │   ├── animales.ts
│   │   │   ├── auth-client.ts
│   │   │   ├── establecimientos.ts
│   │   │   ├── lotes.ts
│   │   │   ├── movimientos.ts
│   │   │   ├── pesajes.ts
│   │   │   └── titulares.ts
│   │   └── utils.ts              # Utilidades
│   ├── stores/                   # Estado global (Zustand)
│   └── types/                    # Tipos TypeScript
├── docs/                         # Documentación del proyecto
│   ├── oficial/                  # Documentación oficial
│   ├── borradores/               # Borradores
│   └── resumenes/                # Resúmenes de implementación
├── public/                       # Archivos estáticos
├── CREDENCIALES-PRUEBA.md        # Credenciales de prueba
├── IMPLEMENTACION-ANIMALES.md    # Documentación de implementación
└── package.json
```

## Módulos Implementados

### 1. Gestión de Animales
- Listado con paginación, búsqueda y filtros
- Creación con múltiples identificadores
- Visualización detallada con historial
- Edición de datos básicos y ubicación
- Eliminación con confirmación

### 2. Gestión de Titulares
- CRUD completo de titulares
- Validación de RUT chileno
- Gestión de estado (activo/inactivo)
- Asociación con establecimientos

### 3. Gestión de Establecimientos
- CRUD completo de establecimientos
- Asociación con titulares
- Tipos: propio, socio, externo
- Gestión de ubicación y rol predial

### 4. Gestión de Lotes
- Creación y gestión de lotes operativos
- Asignación de animales a lotes
- Estados: activo, cerrado, archivado

### 5. Registro de Pesajes
- Sesiones de pesaje por lote
- Importación desde XR5000 (CSV/TXT)
- Historial de pesos por animal
- Validación de datos

### 6. Movimientos de Ganado
- Traslados entre establecimientos
- Ventas y compras
- Bajas por muerte
- Estados: borrador, confirmado, informado

### 7. Reportes y Dashboard
- Stock actual por establecimiento
- Estadísticas de ganado
- Evolución de pesos
- Resumen de movimientos

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
```

## Endpoints del Backend

El frontend consume los siguientes endpoints del backend-agente:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil del usuario

### Animales
- `GET /api/v1/ganado/animales` - Listar animales
- `POST /api/v1/ganado/animales` - Crear animal
- `GET /api/v1/ganado/animales/:id` - Obtener animal
- `PATCH /api/v1/ganado/animales/:id` - Actualizar animal
- `DELETE /api/v1/ganado/animales/:id` - Eliminar animal

### Titulares
- `GET /api/v1/ganado/titulares` - Listar titulares
- `POST /api/v1/ganado/titulares` - Crear titular
- `PATCH /api/v1/ganado/titulares/:id` - Actualizar titular

### Establecimientos
- `GET /api/v1/ganado/establecimientos` - Listar establecimientos
- `POST /api/v1/ganado/establecimientos` - Crear establecimiento

### Lotes, Pesajes y Movimientos
Ver documentación completa en `/docs/oficial/DOCUMENTO-OFICIAL.md`

## Configuración del Backend

Para ejecutar el proyecto completo, necesitas iniciar el backend:

```bash
cd ../backend-agente
npm run start:dev
```

El backend estará disponible en `http://localhost:8089`

### Verificar que el Backend está Corriendo

```bash
# Verificar health check
curl http://localhost:8089/health

# Debería retornar:
# {"status":"ok","timestamp":"...","uptime":...}
```

## Troubleshooting

### Error 401 (Unauthorized) en las peticiones

**Causa:** Token JWT expirado o API Key inválida

**Solución:**
1. Verifica que `NEXT_PUBLIC_API_KEY` esté configurada en `.env.local`
2. Cierra sesión y vuelve a iniciar sesión en la aplicación
3. Si el problema persiste, limpia el localStorage:
   ```javascript
   // En la consola del navegador (F12)
   localStorage.removeItem('access_token');
   window.location.href = '/login';
   ```

### Error 500 en `/animales` u otros endpoints

**Causa:** Error del servidor, generalmente por falta de autenticación

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:8089/health`
2. Revisa los logs del backend para más detalles
3. Asegúrate de estar autenticado correctamente

### No se puede conectar con el servidor

**Causa:** Backend no está corriendo o URL incorrecta

**Solución:**
1. Verifica que el backend esté corriendo en el puerto 8089
2. Verifica que `NEXT_PUBLIC_API_URL` en `.env.local` sea correcta
3. Verifica que no haya problemas de CORS

### Los datos no se cargan en el dashboard

**Causa:** Token expirado o problemas de autenticación

**Solución:**
1. Abre la consola del navegador (F12) y revisa los errores
2. Verifica el Network tab para ver qué peticiones fallan
3. Cierra sesión y vuelve a iniciar sesión

## Documentación Adicional

- **Configuración de entorno:** [`/docs/ENV-CONFIG.md`](./docs/ENV-CONFIG.md)
- **Credenciales de prueba:** [`/docs/CREDENCIALES-PRUEBA.md`](./docs/CREDENCIALES-PRUEBA.md)
- **Cálculo de producto final:** [`/docs/CALCULO-PF-MI-GANADO.md`](./docs/CALCULO-PF-MI-GANADO.md)
- **Propuesta SaaS:** [`/docs/PROPUESTA-SAAS-MI-GANADO.md`](./docs/PROPUESTA-SAAS-MI-GANADO.md)

## Próximos Pasos

### En Desarrollo
- [ ] Modo offline completo (PWA)
- [ ] Sincronización en background
- [ ] Importación XR5000 mejorada
- [ ] Gráficos de evolución de peso
- [ ] Exportación de reportes (Excel/CSV)

### Planificado
- [ ] Integración con SIPEC/SAG
- [ ] Módulo sanitario (vacunas, tratamientos)
- [ ] Gestión documental avanzada
- [ ] Notificaciones push
- [ ] Multi-especie (ovinos, caprinos)

## Arquitectura de Autenticación

El sistema utiliza un esquema de autenticación de dos niveles:

1. **API Key (X-API-Key header):** Requerida para todas las peticiones al backend
   - Se configura en `NEXT_PUBLIC_API_KEY`
   - Valida que la aplicación frontend está autorizada
   - Se envía en todas las peticiones HTTP

2. **JWT Token (Authorization header):** Requerido para endpoints protegidos
   - Se obtiene al hacer login exitoso
   - Se almacena en `localStorage` como `access_token`
   - Expira después de cierto tiempo (requiere re-login)
   - Se envía como `Bearer <token>` en peticiones autenticadas

### Flujo de Autenticación

```
1. Usuario ingresa email/password
2. Frontend envía POST /auth/login con API Key
3. Backend valida credenciales y retorna JWT token
4. Frontend guarda token en localStorage
5. Todas las peticiones subsecuentes incluyen:
   - X-API-Key header (API Key)
   - Authorization header (JWT token)
```

## Soporte

Para problemas o dudas:
1. Revisar la sección **Troubleshooting** arriba
2. Revisar la documentación en `/docs`
3. Verificar logs del backend: `cd ../backend-agente && npm run start:dev`
4. Usar Network tab del navegador (F12) para debugging de peticiones HTTP
5. Verificar la consola del navegador para errores de JavaScript

## Licencia

Proyecto privado - Todos los derechos reservados
