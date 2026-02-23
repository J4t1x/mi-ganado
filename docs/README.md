# Mi Ganado — Índice de Documentación

**Última actualización:** 2026-02-11

Plataforma web progresiva (PWA) para gestión integral de ganado bovino en Chile. Centraliza trazabilidad, cumplimiento normativo SIPEC/SAG y operaciones ganaderas con soporte offline-first.

---

## Documentos Principales

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura técnica, stack, modelo de datos, diagramas Mermaid | 2026-02-11 |
| [STATUS.md](./STATUS.md) | Estado actual de módulos, bugs activos, próximas prioridades | 2026-02-11 |
| [CONVENTIONS.md](./CONVENTIONS.md) | Patrones de código, naming, estructura de módulos CRUD | 2026-02-11 |
| [ANALITICA-VERCEL.md](./ANALITICA-VERCEL.md) | Informe de analítica, métricas de rendimiento y monitoreo | 2026-02-09 |

---

## Especificaciones Funcionales (`specs/`)

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [MODULOS-Y-FUNCIONALIDADES.md](./specs/MODULOS-Y-FUNCIONALIDADES.md) | Detalle completo de los 9 módulos, endpoints, puntos de función | 2026-02-05 |
| [DOCUMENTO-OFICIAL.md](./specs/DOCUMENTO-OFICIAL.md) | Documento oficial del proyecto (alcance, fases, ERD, diseño) | 2026-01-29 |
| [SCOPING-PROYECTO.md](./specs/SCOPING-PROYECTO.md) | Scoping inicial: alcance funcional, técnico, fuera de alcance | 2026-01-29 |

## Estado de Implementación (`implementation/`)

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [IMPLEMENTACION-ANIMALES.md](./implementation/IMPLEMENTACION-ANIMALES.md) | CRUD completo de animales: archivos, componentes, services | 2026-02-03 |
| [IMPLEMENTACION-RAZAS.md](./implementation/IMPLEMENTACION-RAZAS.md) | Módulo de razas: catálogo por especie | 2026-02-03 |
| [RESUMEN-IMPLEMENTACION.md](./implementation/RESUMEN-IMPLEMENTACION.md) | Resumen de avance frontend ↔ backend por módulo | 2026-01-30 |
| [IMPLEMENTACION-RESPONSIVE-MOBILE.md](./implementation/IMPLEMENTACION-RESPONSIVE-MOBILE.md) | Responsive mobile: Sheet nav, card views, filtros, paginación | 2026-02-09 |
| [IMPLEMENTACION-VERCEL.md](./implementation/IMPLEMENTACION-VERCEL.md) | Configuración y despliegue en Vercel | 2026-02-09 |

## Troubleshooting (`troubleshooting/`)

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [SOLUCION-ERRORES-DESPLIEGUE.md](./troubleshooting/SOLUCION-ERRORES-DESPLIEGUE.md) | Errores 404, CORS, rutas faltantes en despliegue | 2026-02-01 |
| [SOLUCION-THROTTLING.md](./troubleshooting/SOLUCION-THROTTLING.md) | Error 429: cache en memoria, deduplicación de requests | 2026-02-01 |

## Comercial (`commercial/`)

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [CALCULO-PF-MI-GANADO.md](./commercial/CALCULO-PF-MI-GANADO.md) | Cálculo IFPUG: 374 PF, valoración USD $157,080 | 2026-02-03 |
| [PROPUESTA-MARIA-AUAD-CLIENTE-FUNDADOR.md](./commercial/PROPUESTA-MARIA-AUAD-CLIENTE-FUNDADOR.md) | Propuesta cliente fundador #1: condiciones especiales | 2026-02-04 |
| [PROPUESTA-SAAS-MI-GANADO.md](./commercial/PROPUESTA-SAAS-MI-GANADO.md) | Modelo SaaS: onboarding + licencia mensual | 2026-02-03 |
| [mariaauad/](./commercial/mariaauad/) | Datos del cliente: análisis Excel, mapeo campos, inventario | 2026-01-16 |

## Configuración (`config/`)

| Documento | Descripción | Actualizado |
|-----------|-------------|-------------|
| [ENV-CONFIG.md](./config/ENV-CONFIG.md) | Variables de entorno: API URL, API Key, configuración | 2026-02-01 |
| [CREDENCIALES-PRUEBA.md](./config/CREDENCIALES-PRUEBA.md) | Credenciales de testing para desarrollo local | 2026-02-01 |

## Archivo (`archive/`)

Documentos obsoletos o temporales que se conservan como referencia:
- `RESUMEN-EJECUTIVO.md` — Resumen ejecutivo completo de la aplicación (módulos, stack, métricas, modelo comercial)
- `MANUAL-USUARIO.md` — Manual de usuario completo (16 capítulos, todos los módulos, glosario)
- `PF-SASS.md` — Borrador inicial de propuesta SaaS
- `RESUMEN-CORRECCION.md` — Redundante con troubleshooting/
- `logs/logdespliegue.md` — Log crudo de despliegue (200KB)

---

## Configuración Windsurf

| Archivo | Propósito |
|---------|-----------|
| `.windsurf/rules/mi-ganado.md` | Reglas de contexto para Cascade (stack, estructura, convenciones) |
| `.windsurf/workflows/mi-ganado-dev.md` | Workflow de desarrollo frontend (setup, CRUD, deploy) |
| `.windsurf/workflows/mi-ganado-docs.md` | Workflow de auditoría y actualización de documentación |
| `.windsurf/workflows/mi-ganado-docs-order.md` | Ordenar y mantener la carpeta docs/ |
| `.windsurf/workflows/mi-ganado-auth.md` | Flujo de auth y sesión |
| `.windsurf/workflows/mi-ganado-github.md` | Subida a GitHub con Conventional Commits |
| `.windsurf/workflows/mi-ganado-vercel.md` | Operaciones con Vercel CLI (deploy, inspect, env, rollback) |
| `.windsurf/workflows/mi-ganado-analytics.md` | Analítica, métricas de rendimiento y logs de producción |

## Enlaces Rápidos

- **Frontend:** `src/` (Next.js 16 App Router)
- **Backend:** repo `backend-agente` (NestJS + Prisma)
- **Swagger:** `http://localhost:8089/api`
- **Health Check:** `http://localhost:8089/health`
