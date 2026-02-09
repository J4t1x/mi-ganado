# Estado Actual — Mi Ganado

**Última actualización:** 2026-02-08

## Módulos del Dashboard

| Módulo | Estado | Páginas | Service API | Componentes |
|--------|--------|---------|-------------|-------------|
| **Titulares** | ✅ Completo | CRUD | `titulares.ts` | `titulares/` |
| **Establecimientos** | ✅ Completo | CRUD | `establecimientos.ts` | `establecimientos/` |
| **Animales** | ✅ Completo | CRUD + detalle | `animales.ts` | `animales/` |
| **Razas** | ✅ Completo | CRUD | `razas.ts` | — |
| **Lotes** | ✅ Completo | CRUD | `lotes.ts` | — |
| **Pesajes** | 🔧 En desarrollo | Listado | `pesajes.ts` | — |
| **Movimientos** | 🔧 En desarrollo | Listado | `movimientos.ts` | — |
| **Reportes** | 📋 Planificado | Placeholder | — | — |
| **Dashboard** | ✅ Completo | Stats | `dashboard.ts` | `dashboard/` |

## Infraestructura

| Componente | Estado | URL |
|-----------|--------|-----|
| **Frontend (Vercel)** | ✅ Desplegado | Configurado |
| **Backend (Railway)** | ✅ Desplegado | Configurado |
| **PostgreSQL** | ✅ Activo | Railway |
| **PWA / Service Worker** | ✅ Registrado | — |
| **Offline mode** | 🔧 Parcial (store creado) | — |

## Bugs Activos

- Ninguno conocido

## Próximas Prioridades

1. Completar módulo de pesajes (integración XR5000)
2. Completar módulo de movimientos (flujo completo)
3. Implementar reportes y estadísticas
4. Mejorar modo offline (sync queue)
