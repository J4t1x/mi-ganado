# Estado Actual — Mi Ganado

**Última actualización:** 2026-02-09 (Sprint 7 — FINAL)

## Sprints Completados

| Sprint | Foco | Estado | Fecha |
|--------|------|--------|-------|
| **Sprint 1** | Completar lo parcial (Quick Wins) | ✅ Completado | 2026-02-09 |
| **Sprint 2** | Reportes reales + gráficos | ✅ Completado | 2026-02-09 |
| **Sprint 3** | Mejoras UX + Auth | ✅ Completado | 2026-02-09 |
| **Sprint 4** | Módulo Sanitario | ✅ Completado | 2026-02-09 |
| **Sprint 5** | Offline & PWA | ✅ Completado | 2026-02-09 |
| **Sprint 6** | Módulo Financiero | ✅ Completado | 2026-02-09 |
| **Sprint 7** | Notificaciones y Alertas | ✅ Completado | 2026-02-09 |

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

### Sprint 5 — Detalle
- SP-23: Offline page `/offline` + hook `useOnlineStatus` ✅
- SP-24: Sync queue IndexedDB + SyncManager (auto-sync on reconnect) ✅
- SP-25: SW v2 — API cache, stale-while-revalidate, offline mutation queue ✅
- SP-26: PWA install prompt + mobile nav fix (Sanitario link) ✅
- SP-27: Dashboard layout integration (SyncManager + InstallPrompt) ✅

### Sprint 6 — Detalle
- SP-28: API service financiero (`src/lib/api/financiero.ts`) — costos + ventas CRUD ✅
- SP-29: Página principal financiero — tabs Costos/Ventas, summary cards, PieChart ✅
- SP-30: Registro de costos — CRUD con tipo, concepto, monto, proveedor, documento ✅
- SP-31: Registro de ventas — comprador, animales, precio, forma pago, estado pago ✅
- SP-32: Dashboard rentabilidad — cards (costos/ventas/rentabilidad/pendientes) + PieChart distribución ✅
- SP-33: Sidebar + mobile nav link "Financiero" con icono DollarSign ✅

### Sprint 7 — Detalle
- SP-34: Notifications store (Zustand + persist en localStorage, max 50) ✅
- SP-35: Centro de notificaciones — dropdown en header con badge, mark read, clear ✅
- SP-36: Motor de alertas automáticas — sanitario vencidos/hoy, ventas pendientes, movimientos borrador ✅
- SP-37: Página configuración de alertas — switches por categoría + estado notificaciones ✅
- SP-38: Fix bug Turbopack parse en movimientos (fragment → div) ✅

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
| **Financiero** | ✅ Completo | Costos + ventas + rentabilidad + PieChart | `financiero.ts` | `financiero/` |
| **Notificaciones** | ✅ Completo | Centro notificaciones + alertas automáticas + config | `notifications-store.ts` | `notifications/` |

## Infraestructura

| Componente | Estado | URL |
|-----------|--------|-----|
| **Frontend (Vercel)** | ✅ Desplegado | Configurado |
| **Backend (Railway)** | ✅ Desplegado | Configurado |
| **PostgreSQL** | ✅ Activo | Railway |
| **PWA / Service Worker** | ✅ Registrado | — |
| **Offline mode** | ✅ Completo | SW v2 + sync queue + auto-sync |

## Dependencias Nuevas
- `recharts` — Gráficos interactivos (Sprint 2)

## Bugs Activos

- Ninguno conocido

## Pendientes Backend
- `/auth/forgot-password` — Endpoint para recuperación de contraseña
- `/auth/change-password` — Endpoint para cambio de contraseña
- `padreId`/`madreId` en modelo Animal — Para genealogía básica (SP-14)

## Próximas Prioridades

1. **Endpoints backend** — Sanitario, financiero, auth (forgot/change password)
2. **Testing** — Unit tests + E2E con Playwright
3. **Integración SIPEC/SAG** — Trazabilidad oficial
4. **Módulo Reproducción** — Servicios, gestación, partos
