# Mi Ganado — Reglas de Proyecto para Cascade

## Descripción
Plataforma web progresiva (PWA) para gestión integral de ganado bovino en Chile. Centraliza trazabilidad, cumplimiento normativo SIPEC/SAG y operaciones ganaderas con soporte offline-first.

## Stack Técnico

### Frontend (este repo: mi-ganado)
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3 + TailwindCSS 4 + tw-animate-css
- **Componentes:** shadcn/ui + Radix UI
- **Estado global:** Zustand 5 (con persist middleware)
- **Data fetching:** TanStack Query 5
- **Formularios:** React Hook Form 7 + Zod 4
- **Animaciones:** Framer Motion 12
- **Iconos:** Lucide React
- **Notificaciones:** Sonner
- **Analytics:** Vercel Analytics
- **Fuentes:** Inter (sans) + JetBrains Mono (mono)

### Backend (repo: backend-agente)
- **Framework:** NestJS + Prisma + PostgreSQL
- **Base URL:** configurable via `API_URL` (default: auto-detect por NODE_ENV)
- **API Key:** configurable via `API_KEY` (sin prefijo NEXT_PUBLIC_)
- **Config centralizada:** `src/lib/api/config.ts` (exports: `API_CONFIG`, `getApiConfig()`, `buildHeaders()`)
- **Endpoints:** bajo `/api/v1/ganado/` (módulo ganado) y `/auth/` (autenticación)
- **Auth:** JWT en localStorage (`access_token`)

## Estructura del Frontend

```
src/
├── app/                          # App Router pages
│   ├── (auth)/                   # Páginas públicas (login, registro)
│   ├── dashboard/                # Páginas protegidas con AuthGuard
│   │   ├── animales/             # CRUD animales + detalle + genealogía
│   │   ├── configuracion/        # Titulares, establecimientos, razas, alertas, cambiar-password
│   │   ├── lotes/                # Gestión de lotes + stats GDP
│   │   ├── movimientos/          # Movimientos de ganado
│   │   ├── pesajes/              # Sesiones de pesaje + importar XR5000
│   │   ├── sanitario/            # Eventos sanitarios + calendario
│   │   ├── financiero/           # Costos + ventas + rentabilidad
│   │   ├── reportes/             # Reportes y estadísticas (stock, mov, pesajes)
│   │   ├── ayuda/                # Página de ayuda
│   │   ├── error.tsx             # Error boundary del dashboard
│   │   ├── layout.tsx            # Dashboard layout (AuthGuard + Sidebar + Header)
│   │   └── page.tsx              # Dashboard principal (stats + gráficos)
│   ├── layout.tsx                # Root layout (PWA, SW, fonts)
│   └── page.tsx                  # Landing/redirect
├── components/
│   ├── animales/                 # Componentes específicos de animales
│   ├── auth/                     # AuthGuard, login forms
│   ├── dashboard/                # Widgets: skeleton, error-state, refresh-button
│   ├── establecimientos/         # CRUD establecimientos
│   ├── layout/                   # Sidebar, Header
│   ├── notifications/            # notification-center, alert-checker
│   ├── offline/                  # install-prompt, sync-manager
│   ├── titulares/                # CRUD titulares
│   └── ui/                       # shadcn/ui components (22 archivos)
├── lib/
│   ├── api/                      # API clients por módulo
│   │   ├── config.ts             # Config centralizada (API_URL, API_KEY, buildHeaders)
│   │   ├── client.ts             # ApiClient base (singleton)
│   │   ├── auth-client.ts        # Service: auth (login, registro)
│   │   ├── cache.ts              # Cache en memoria (5 min TTL)
│   │   ├── animales.ts           # Service: animales
│   │   ├── establecimientos.ts   # Service: establecimientos
│   │   ├── titulares.ts          # Service: titulares (client-side)
│   │   ├── titulares-actions.ts  # Server actions: titulares
│   │   ├── server-actions.ts     # Server actions genéricas
│   │   ├── lotes.ts              # Service: lotes
│   │   ├── pesajes.ts            # Service: pesajes
│   │   ├── movimientos.ts        # Service: movimientos
│   │   ├── razas.ts              # Service: razas
│   │   ├── sanitario.ts          # Service: sanitario
│   │   ├── financiero.ts         # Service: financiero (costos + ventas)
│   │   └── dashboard.ts          # Service: dashboard stats
│   ├── alerts/                   # Motor de alertas automáticas
│   │   └── alert-engine.ts       # Alertas: sanitario, ventas, movimientos
│   ├── offline/                  # Offline/PWA support
│   │   └── sync-queue.ts         # IndexedDB sync queue + SyncManager
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── stores/
│   ├── auth-store.ts             # Zustand: auth state (persist)
│   ├── notifications-store.ts    # Zustand: notifications (persist, max 50)
│   └── offline-store.ts          # Zustand: offline queue
└── types/
    └── index.ts                  # TypeScript types compartidos
```

## Convenciones de Código

- **Idioma:** código en inglés (variables, funciones), UI en español
- **API client:** centralizado en `src/lib/api/client.ts` — NUNCA hacer fetch directo
- **Cada módulo** tiene su service file en `src/lib/api/{modulo}.ts`
- **Componentes UI:** usar shadcn/ui, no crear componentes custom si existe equivalente
- **Validaciones:** Zod schemas, integrados con React Hook Form via `@hookform/resolvers`
- **Estado global:** Zustand solo para auth y offline. Datos del servidor via TanStack Query
- **Layout:** Dashboard usa `AuthGuard` + `Sidebar` + `Header` (ver `dashboard/layout.tsx`)
- **Estilos:** TailwindCSS utility classes, NO CSS modules ni styled-components
- **Imports:** usar alias `@/` para `src/`

## Documentación

La documentación del proyecto está organizada en `docs/`:
- **`docs/ARCHITECTURE.md`** — Resumen técnico conciso
- **`docs/STATUS.md`** — Estado actual de módulos y prioridades
- **`docs/CONVENTIONS.md`** — Patrones detallados de desarrollo
- **`docs/specs/`** — Especificaciones funcionales
- **`docs/implementation/`** — Estado de implementación por módulo
- **`docs/troubleshooting/`** — Bugs resueltos (base de conocimiento)
- **`docs/commercial/`** — Propuestas y cálculos comerciales
- **`docs/config/`** — Configuración de entorno

## Regla de Auto-Mantenimiento

Cuando completes una tarea que:
1. **Modifique la arquitectura o stack** → Actualiza este archivo y `docs/ARCHITECTURE.md`
2. **Agregue o complete un módulo** → Actualiza `docs/STATUS.md` y `docs/implementation/`
3. **Resuelva un bug no trivial** → Documéntalo en `docs/troubleshooting/`
4. **Cambie convenciones o patrones** → Actualiza `docs/CONVENTIONS.md`
5. **Agregue un nuevo service en `lib/api/`** → Actualiza la estructura en este archivo

## Deploy
- **Frontend:** Vercel
- **Backend:** Railway
- **DB:** PostgreSQL (Railway)
