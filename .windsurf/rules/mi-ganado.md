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
- **Base URL:** configurable via `NEXT_PUBLIC_API_URL` (default: `http://localhost:8089`)
- **API Key:** configurable via `NEXT_PUBLIC_API_KEY`
- **Endpoints:** bajo `/api/v1/ganado/` (módulo ganado) y `/auth/` (autenticación)
- **Auth:** JWT en localStorage (`access_token`)

## Estructura del Frontend

```
src/
├── app/                          # App Router pages
│   ├── (auth)/                   # Páginas públicas (login, registro)
│   ├── dashboard/                # Páginas protegidas con AuthGuard
│   │   ├── animales/             # CRUD animales
│   │   ├── configuracion/        # Titulares y establecimientos
│   │   ├── lotes/                # Gestión de lotes
│   │   ├── movimientos/          # Movimientos de ganado
│   │   ├── pesajes/              # Sesiones de pesaje
│   │   └── reportes/             # Reportes y estadísticas
│   ├── layout.tsx                # Root layout (PWA, SW, fonts)
│   └── page.tsx                  # Landing/redirect
├── components/
│   ├── animales/                 # Componentes específicos de animales
│   ├── auth/                     # AuthGuard, login forms
│   ├── dashboard/                # Widgets del dashboard
│   ├── establecimientos/         # CRUD establecimientos
│   ├── layout/                   # Sidebar, Header
│   ├── titulares/                # CRUD titulares
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api/                      # API clients por módulo
│   │   ├── client.ts             # ApiClient base (singleton)
│   │   ├── cache.ts              # Cache en memoria (5 min TTL)
│   │   ├── animales.ts           # Service: animales
│   │   ├── establecimientos.ts   # Service: establecimientos
│   │   ├── titulares.ts          # Service: titulares
│   │   ├── lotes.ts              # Service: lotes
│   │   ├── pesajes.ts            # Service: pesajes
│   │   ├── movimientos.ts        # Service: movimientos
│   │   ├── razas.ts              # Service: razas
│   │   └── dashboard.ts          # Service: dashboard stats
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
├── stores/
│   ├── auth-store.ts             # Zustand: auth state (persist)
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
