# Arquitectura Técnica — Mi Ganado

**Última actualización:** 2026-02-24

## Diagrama General

```mermaid
graph TB
    subgraph Frontend ["Frontend (mi-ganado)"]
        NextJS["Next.js 16 App Router"]
        UI["shadcn/ui + Radix UI"]
        State["Zustand + TanStack Query"]
        ApiLib["lib/api/ (services)"]
        SW["Service Worker (PWA)"]
    end

    subgraph Backend ["Backend (backend-agente)"]
        NestJS["NestJS"]
        Prisma["Prisma ORM"]
        Auth["Auth Module (JWT)"]
        Ganado["Ganado Module"]
    end

    subgraph DB ["Base de Datos"]
        PG["PostgreSQL"]
    end

    subgraph Deploy ["Infraestructura"]
        Vercel["Vercel (Frontend)"]
        Railway["Railway (Backend + DB)"]
    end

    NextJS --> ApiLib
    ApiLib -->|"HTTP REST"| NestJS
    NestJS --> Auth
    NestJS --> Ganado
    Ganado --> Prisma
    Auth --> Prisma
    Prisma --> PG
    NextJS --> Vercel
    NestJS --> Railway
    PG --> Railway
```

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI | React + TailwindCSS 4 | 19.2.3 |
| Componentes | shadcn/ui + Radix UI | latest |
| Estado | Zustand (auth, offline, notifications) | 5.0.10 |
| Data fetching | TanStack Query | 5.90.20 |
| Formularios | React Hook Form + Zod | 7.71.1 + 4.3.6 |
| Gráficos | Recharts | 3.7.0 |
| Animaciones | Framer Motion | 12.29.2 |
| Notificaciones | Sonner | 2.0.7 |
| Temas | next-themes | 0.4.6 |
| Iconos | Lucide React | 0.563.0 |
| Analytics | @vercel/analytics + @vercel/speed-insights | 1.6.1 / 1.3.1 |
| Export PDF | jspdf + html2canvas | 4.2.0 / 1.4.1 |
| Linting | ESLint | 10.0.2 |
| Backend | NestJS + Prisma | — |
| DB | PostgreSQL | — |
| Deploy FE | Vercel | — |
| Deploy BE | Railway | — |

## Modelo de Datos (Entidades Principales)

```mermaid
erDiagram
    Titular ||--o{ Establecimiento : "posee"
    Titular ||--o{ Animal : "titular actual"
    Establecimiento ||--o{ Animal : "ubicación actual"
    Establecimiento ||--o{ Lote : "contiene"
    Lote ||--o{ Animal : "agrupa"
    Animal ||--o{ Identificador : "tiene"
    Animal ||--o{ ManejoSanitario : "registra"
    Animal ||--o| Animal : "padre"
    Animal ||--o| Animal : "madre"
    Animal ||--o{ Pesaje : "pesa"
    SesionPesaje ||--o{ Pesaje : "contiene"
    Lote ||--o{ SesionPesaje : "asociada"
    Movimiento ||--o{ MovimientoDetalle : "incluye"
    Movimiento ||--o{ Documento : "adjunta"
    Animal ||--o{ MovimientoDetalle : "participa"
    Establecimiento ||--o{ Movimiento : "origen"
    Establecimiento ||--o{ Movimiento : "destino"
    Raza ||--o{ Animal : "clasifica"
```

### Entidades

| Entidad | Descripción | Enums clave |
|---------|-------------|-------------|
| **Titular** | Dueño del ganado (persona/empresa) | TipoTitular, EstadoGeneral |
| **Establecimiento** | Predio ganadero (propio/socio/externo) | TipoEstablecimiento |
| **Animal** | Bovino individual con trazabilidad SIPEC | Especie, Sexo, CategoriaAnimal, EstadoAnimal |
| **Identificador** | DIIO, RFID, Chip, Bolus por animal | TipoIdentificador |
| **Raza** | Catálogo de razas por especie | Especie |
| **Lote** | Agrupación de animales en un establecimiento | EstadoGeneral |
| **SesionPesaje** | Sesión de pesaje (equipo, operador, fecha) | — |
| **Pesaje** | Peso individual de un animal | OrigenDato (XR5000/MANUAL) |
| **Movimiento** | Traslado, venta, compra, muerte, ajuste | TipoMovimiento, EstadoMovimiento |
| **MovimientoDetalle** | Animal incluido en un movimiento | — |
| **Documento** | Guía de despacho, factura, formulario | TipoDocumento |
| **ManejoSanitario** | Registro sanitario por animal | — |
| **Genealogía** | Self-relations: `padreId`/`madreId` en Animal | — |

## Flujo de Autenticación

1. Login via `POST /auth/login` → recibe `access_token` (JWT)
2. Token se almacena en `localStorage`
3. `ApiClient` adjunta token en header `Authorization: Bearer {token}`
4. `AuthGuard` protege rutas `/dashboard/*`
5. `useAuthStore` (Zustand + persist) mantiene estado de sesión

## Flujo de Datos (Frontend)

```
Page → Service (lib/api/{modulo}.ts) → ApiClient (lib/api/client.ts) → Backend REST API
                                              ↓
                                     Cache (lib/api/cache.ts) — TTL 5 min
```

- **TanStack Query** maneja cache de servidor, refetch, y estados de loading/error
- **Cache manual** (`cache.ts`) previene throttling en endpoints frecuentes (titulares)
- **Zustand** solo para estado local persistente (auth, offline queue, notifications)

## Decisiones Técnicas

- **App Router** (no Pages Router) — layouts anidados, server components donde aplique
- **PWA con Service Worker** — registro en `layout.tsx`, manifest en `public/`
- **API Key + JWT** — doble capa de autenticación (API key para el app, JWT para el usuario)
- **Singleton ApiClient** — una instancia exportada, base URL configurable via env
- **shadcn/ui** — componentes copiados a `src/components/ui/`, no como dependencia
