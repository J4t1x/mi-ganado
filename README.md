# Mi Ganado - Sistema de Gestión Ganadera Digital

**Versión:** 1.0  
**Estado:** En desarrollo activo  
**Última actualización:** Febrero 2026

## Descripción

**Mi Ganado** es una plataforma web progresiva (PWA) diseñada para la gestión integral de ganado bovino en Chile. El sistema permite a titulares de establecimientos ganaderos centralizar, trazar y gestionar eficientemente toda la información de su ganado, facilitando el cumplimiento normativo con SIPEC/SAG.

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

Crear archivo `.env.local`:
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8089
NEXT_PUBLIC_API_KEY=tu_api_key_aqui

# Para producción
# NEXT_PUBLIC_API_URL=https://jard.up.railway.app
```

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
cd /Users/ja/Documents/GitHub/backend-agente
npm run start:dev
```

El backend estará disponible en `http://localhost:8089`

## Documentación Adicional

- **Documento oficial:** `/docs/oficial/DOCUMENTO-OFICIAL.md`
- **Implementación de animales:** `IMPLEMENTACION-ANIMALES.md`
- **Credenciales de prueba:** `CREDENCIALES-PRUEBA.md`

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

## Soporte

Para problemas o dudas:
1. Revisar la documentación en `/docs`
2. Verificar logs del backend
3. Usar Network tab del navegador para debugging

## Licencia

Proyecto privado - Todos los derechos reservados
