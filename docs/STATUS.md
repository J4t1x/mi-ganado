# Estado Actual — Mi Ganado

**Última actualización:** 2026-02-09 (Sprint 4)

## Sprints Completados

| Sprint | Foco | Estado | Fecha |
|--------|------|--------|-------|
| **Sprint 1** | Completar lo parcial (Quick Wins) | ✅ Completado | 2026-02-09 |
| **Sprint 2** | Reportes reales + gráficos | ✅ Completado | 2026-02-09 |
| **Sprint 3** | Mejoras UX + Auth | ✅ Completado | 2026-02-09 |
| **Sprint 4** | Módulo Sanitario | ✅ Completado | 2026-02-09 |

### Sprint 1 — Detalle
- SP-01: Movimientos crear conectado a API ✅
- SP-02: Selector de animales en movimientos ✅
- SP-03: Página detalle movimiento `/dashboard/movimientos/[id]` ✅
- SP-04: Página detalle sesión pesaje `/dashboard/pesajes/[id]` ✅
- SP-05: Importación XR5000 funcional (parseo CSV/TXT + API) ✅
- SP-06: Razas CRUD FE + sidebar link ✅

### Sprint 2 — Detalle
- SP-07: Reportes stock desde API (reemplaza datos hardcodeados) ✅
- SP-08: Reporte movimientos por período con filtros de fecha ✅
- SP-09: Reporte pesajes con cálculo GDP estimado ✅
- SP-10: Exportación CSV en cada reporte (stock, movimientos, pesajes) ✅
- SP-11: Dashboard con gráficos Recharts (PieChart + BarChart) ✅

### Sprint 3 — Detalle
- SP-12: Exportación CSV de animales (respeta filtros activos) ✅
- SP-13: Gráfico evolución de peso en detalle animal (LineChart + stats) ✅
- SP-14: Genealogía básica — ⏭️ SKIP (requiere padreId/madreId en backend)
- SP-15: Lotes stats avanzadas (GDP, dispersión, LineChart evolución) ✅
- SP-16: Recuperación de contraseña — FE listo (`/forgot-password`), BE pendiente ✅
- SP-17: Cambiar contraseña desde perfil (`/dashboard/configuracion/cambiar-password`) ✅

### Sprint 4 — Detalle
- SP-18: API service sanitario (`src/lib/api/sanitario.ts`) + tipos completos ✅
- SP-19: Página principal sanitario — listado, filtros, crear evento, stats, CSV export ✅
- SP-20: Detalle evento sanitario — vista + edición inline + eliminar ✅
- SP-21: Calendario sanitario — tab "Próximos 30 días" con alertas por urgencia ✅
- SP-22: Sidebar link "Sanitario" con icono Syringe ✅

## Módulos del Dashboard

| Módulo | Estado | Páginas | Service API | Componentes |
|--------|--------|---------|-------------|-------------|
| **Titulares** | ✅ Completo | CRUD | `titulares.ts` | `titulares/` |
| **Establecimientos** | ✅ Completo | CRUD | `establecimientos.ts` | `establecimientos/` |
| **Animales** | ✅ Completo | CRUD + detalle + gráfico peso + CSV export | `animales.ts` | `animales/` |
| **Razas** | ✅ Completo | CRUD + filtro especie + toggle estado | `razas.ts` | `configuracion/razas/` |
| **Lotes** | ✅ Completo | CRUD + detalle + stats GDP/dispersión | `lotes.ts` | `lotes/` |
| **Pesajes** | ✅ Completo | Listado + detalle + crear + importar XR5000 | `pesajes.ts` | `pesajes/` |
| **Movimientos** | ✅ Completo | Listado + crear + detalle + confirmar + selector animales | `movimientos.ts` | `movimientos/` |
| **Reportes** | ✅ Completo | Tabs (Stock/Movimientos/Pesajes) + filtros + CSV export | `dashboard.ts` + services | `reportes/` |
| **Dashboard** | ✅ Completo | Stats + PieChart + BarChart + tabla movimientos | `dashboard.ts` | `dashboard/` |
| **Auth** | ✅ Completo | Login + registro + forgot password + cambiar contraseña | `auth-client.ts` | `(auth)/` |
| **Sanitario** | ✅ Completo | Listado + detalle + crear + editar + calendario | `sanitario.ts` | `sanitario/` |

## Infraestructura

| Componente | Estado | URL |
|-----------|--------|-----|
| **Frontend (Vercel)** | ✅ Desplegado | Configurado |
| **Backend (Railway)** | ✅ Desplegado | Configurado |
| **PostgreSQL** | ✅ Activo | Railway |
| **PWA / Service Worker** | ✅ Registrado | — |
| **Offline mode** | 🔧 Parcial (store creado) | — |

## Dependencias Nuevas
- `recharts` — Gráficos interactivos (Sprint 2)

## Bugs Activos

- Ninguno conocido

## Pendientes Backend
- `/auth/forgot-password` — Endpoint para recuperación de contraseña
- `/auth/change-password` — Endpoint para cambio de contraseña
- `padreId`/`madreId` en modelo Animal — Para genealogía básica (SP-14)

## Próximas Prioridades

1. **Sprint 5** — Modo Offline y PWA (sync queue, cache strategies)
2. **Sprint 6** — Módulo Financiero (costos, ingresos, rentabilidad)
3. **Sprint 7** — Notificaciones y alertas
