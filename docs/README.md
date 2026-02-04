# Mi Ganado - Documentación Ejecutiva del Sistema

**Versión:** 1.0.0  
**Fecha:** 4 de Febrero 2026  
**Estado:** Sistema en producción (85% completado)

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Descripción del Sistema](#descripción-del-sistema)
3. [Funciones Principales](#funciones-principales)
4. [Arquitectura Técnica](#arquitectura-técnica)
5. [Cálculo de Puntos de Función](#cálculo-de-puntos-de-función)
6. [Métricas del Proyecto](#métricas-del-proyecto)
7. [Documentación Relacionada](#documentación-relacionada)

---

## Resumen Ejecutivo

**Mi Ganado** es una plataforma web progresiva (PWA) para la gestión integral de ganado bovino en Chile, diseñada para centralizar la trazabilidad, facilitar el cumplimiento normativo con SIPEC/SAG, y optimizar operaciones ganaderas mediante tecnología offline-first.

### Indicadores Clave

| Métrica | Valor |
|---------|-------|
| **Puntos de Función Ajustados** | 374 PF |
| **Módulos Funcionales** | 9 módulos core |
| **Endpoints API** | 49 endpoints REST |
| **Entidades de Datos** | 12 entidades principales |
| **Avance del Proyecto** | 85% completado |
| **Esfuerzo Estimado Total** | 2,244 horas |
| **Valoración del Proyecto** | USD $157,080 |

---

## Descripción del Sistema

### Propósito

Proporcionar a titulares de establecimientos ganaderos una herramienta digital completa para:

- **Gestionar** el inventario completo de animales con trazabilidad SIPEC
- **Registrar** pesajes automáticos desde equipos XR5000
- **Controlar** movimientos de ganado (traslados, ventas, compras, bajas)
- **Generar** reportes y estadísticas en tiempo real
- **Operar** en terreno sin conectividad (modo offline)

### Contexto Tecnológico

- **Frontend:** Next.js 16 + React 19 + TailwindCSS
- **Backend:** NestJS + Prisma ORM + PostgreSQL
- **Infraestructura:** Railway (producción) + Supabase (base de datos)
- **Autenticación:** JWT + RBAC (3 roles)

---

## Funciones Principales

### 1. Gestión de Titulares

**Descripción:** Administración de propietarios de ganado (personas naturales o jurídicas).

**Funcionalidades:**
- ✅ Crear titular con validación de RUT chileno
- ✅ Editar información de contacto y tipo de titular
- ✅ Activar/desactivar titulares
- ✅ Listar con búsqueda y filtros (estado, tipo)
- ✅ Asociar múltiples establecimientos

**Puntos de Función:**
- ILF: 7 PF (entidad Titular)
- EI: 14 PF (4 operaciones de entrada)
- EQ: 7 PF (2 consultas)
- **Total:** 28 PF

**Endpoints:**
```
GET    /api/v1/ganado/titulares
POST   /api/v1/ganado/titulares
GET    /api/v1/ganado/titulares/:id
PATCH  /api/v1/ganado/titulares/:id
DELETE /api/v1/ganado/titulares/:id
PATCH  /api/v1/ganado/titulares/:id/toggle-estado
```

---

### 2. Gestión de Establecimientos

**Descripción:** Administración de predios ganaderos asociados a titulares.

**Funcionalidades:**
- ✅ Crear establecimiento con ubicación y rol predial
- ✅ Tipos: propio, socio, externo
- ✅ Gestión de estado activo/inactivo
- ✅ Asociación con titular responsable
- ✅ Búsqueda por nombre, titular, tipo

**Puntos de Función:**
- ILF: 10 PF (entidad Establecimiento)
- EI: 14 PF (4 operaciones de entrada)
- EQ: 7 PF (2 consultas)
- **Total:** 31 PF

**Endpoints:**
```
GET    /api/v1/ganado/establecimientos
POST   /api/v1/ganado/establecimientos
GET    /api/v1/ganado/establecimientos/:id
PATCH  /api/v1/ganado/establecimientos/:id
DELETE /api/v1/ganado/establecimientos/:id
PATCH  /api/v1/ganado/establecimientos/:id/toggle-estado
```

---

### 3. Gestión de Animales

**Descripción:** CRUD completo de animales con trazabilidad SIPEC y múltiples identificadores.

**Funcionalidades:**
- ✅ Registro con 18 campos (especie, sexo, categoría, fechas, ubicación)
- ✅ Múltiples identificadores (DIIO, RFID, Chip, Bolus)
- ✅ Historial completo (pesajes, movimientos, identificadores)
- ✅ Búsqueda avanzada con filtros complejos
- ✅ Validaciones de negocio (unicidad DIIO, estado)
- ✅ Gestión de baja de identificadores con motivo

**Puntos de Función:**
- ILF: 22 PF (Animal + Identificador)
- EI: 18 PF (5 operaciones de entrada)
- EO: 7 PF (historial completo)
- EQ: 10 PF (2 consultas)
- **Total:** 57 PF

**Endpoints:**
```
GET    /api/v1/ganado/animales
POST   /api/v1/ganado/animales
GET    /api/v1/ganado/animales/:id
PATCH  /api/v1/ganado/animales/:id
DELETE /api/v1/ganado/animales/:id
POST   /api/v1/ganado/animales/:id/identificadores
PATCH  /api/v1/ganado/identificadores/:id/baja
GET    /api/v1/ganado/animales/:id/historial
```

---

### 4. Gestión de Razas

**Descripción:** Catálogo de razas bovinas con clasificación por especie.

**Funcionalidades:**
- ✅ Crear raza con nombre, especie, descripción
- ✅ Validación de unicidad (nombre + especie)
- ✅ Activar/desactivar razas
- ✅ Filtros por especie y estado

**Puntos de Función:**
- ILF: 7 PF (entidad Raza)
- EI: 9 PF (3 operaciones de entrada)
- EQ: 7 PF (2 consultas)
- **Total:** 23 PF

**Endpoints:**
```
GET    /api/v1/ganado/razas
POST   /api/v1/ganado/razas
GET    /api/v1/ganado/razas/:id
PATCH  /api/v1/ganado/razas/:id
DELETE /api/v1/ganado/razas/:id
```

---

### 5. Gestión de Lotes

**Descripción:** Agrupación operativa de animales para manejo en terreno.

**Funcionalidades:**
- ✅ Crear lote asociado a establecimiento
- ✅ Asignación masiva de animales
- ✅ Remoción de animales del lote
- ✅ Estados: activo, cerrado, archivado
- ✅ Consulta de animales por lote

**Puntos de Función:**
- ILF: 7 PF (entidad Lote)
- EI: 15 PF (5 operaciones de entrada)
- EQ: 8 PF (2 consultas)
- **Total:** 30 PF

**Endpoints:**
```
GET    /api/v1/ganado/lotes
POST   /api/v1/ganado/lotes
GET    /api/v1/ganado/lotes/:id
PATCH  /api/v1/ganado/lotes/:id
DELETE /api/v1/ganado/lotes/:id
POST   /api/v1/ganado/lotes/:id/animales
DELETE /api/v1/ganado/lotes/:id/animales
```

---

### 6. Registro de Pesajes

**Descripción:** Captura de pesos de animales con importación automática desde equipos XR5000.

**Funcionalidades:**
- ✅ Sesiones de pesaje por lote
- ✅ Importación CSV/TXT desde XR5000
- ✅ Parseo automático de archivos (RFID, peso, fecha/hora)
- ✅ Asociación automática RFID → Animal
- ✅ Registro manual de pesajes individuales
- ✅ Validación de datos (peso > 0, fecha válida)
- ✅ Marcar pesajes como válidos/inválidos
- ✅ Historial de pesos por animal

**Puntos de Función:**
- ILF: 17 PF (SesionPesaje + Pesaje)
- EIF: 5 PF (datos XR5000)
- EI: 17 PF (5 operaciones de entrada, incluyendo importación compleja)
- EQ: 8 PF (2 consultas)
- **Total:** 47 PF

**Endpoints:**
```
GET    /api/v1/ganado/sesiones-pesaje
POST   /api/v1/ganado/sesiones-pesaje
GET    /api/v1/ganado/sesiones-pesaje/:id
POST   /api/v1/ganado/sesiones-pesaje/:id/pesajes
POST   /api/v1/ganado/sesiones-pesaje/importar-xr5000
DELETE /api/v1/ganado/pesajes/:id
PATCH  /api/v1/ganado/pesajes/:id/toggle-valido
```

**Formato XR5000:**
```csv
RFID,Peso,Fecha,Hora
982000123456789,450.5,2026-02-04,14:30:00
```

---

### 7. Movimientos de Ganado

**Descripción:** Registro y control de traslados, ventas, compras y bajas de animales.

**Funcionalidades:**
- ✅ Tipos de movimiento: traslado, venta, compra, muerte
- ✅ Creación de movimiento con múltiples animales
- ✅ Estados: borrador, confirmado, informado
- ✅ Confirmación con lógica de negocio:
  - **Traslado:** actualiza establecimiento de animales
  - **Venta:** marca animales como vendidos
  - **Compra:** crea nuevos animales en el sistema
  - **Muerte:** marca animales como muertos
- ✅ Adjuntar documentos (guías, facturas)
- ✅ Filtros complejos (tipo, estado, origen, destino, fechas)

**Puntos de Función:**
- ILF: 29 PF (Movimiento + MovimientoDetalle + DocumentoGanado)
- EI: 16 PF (3 operaciones de entrada, confirmación compleja)
- EO: 5 PF (estadísticas de movimientos)
- EQ: 10 PF (2 consultas)
- **Total:** 60 PF

**Endpoints:**
```
GET    /api/v1/ganado/movimientos
POST   /api/v1/ganado/movimientos
GET    /api/v1/ganado/movimientos/:id
PATCH  /api/v1/ganado/movimientos/:id/confirmar
POST   /api/v1/ganado/movimientos/:id/documentos
GET    /api/v1/ganado/movimientos/estadisticas
```

---

### 8. Dashboard y Reportes

**Descripción:** Visualización de KPIs y estadísticas del sistema.

**Funcionalidades:**
- ✅ Estadísticas generales:
  - Total de animales
  - Animales por estado (activo, vendido, muerto)
  - Total de lotes activos
  - Total de establecimientos
  - Sesiones de pesaje
  - Movimientos recientes
- ✅ Estadísticas por establecimiento:
  - Conteo de animales por predio
  - Distribución de ganado
- ✅ Movimientos recientes con timeline
- ✅ Actualización en tiempo real

**Puntos de Función:**
- EO: 19 PF (3 salidas con agregaciones complejas)
- **Total:** 19 PF

**Endpoints:**
```
GET /api/v1/ganado/dashboard/stats
GET /api/v1/ganado/dashboard/movimientos-recientes
GET /api/v1/ganado/dashboard/establecimientos-stats
```

---

### 9. Autenticación y Autorización

**Descripción:** Sistema de seguridad con JWT y control de acceso basado en roles.

**Funcionalidades:**
- ✅ Login con email/password
- ✅ Generación de token JWT
- ✅ Validación de API Key en todas las peticiones
- ✅ Roles: ADMIN, PROFESSIONAL, PATIENT
- ✅ Perfil de usuario
- ✅ Expiración automática de tokens

**Puntos de Función:**
- ILF: 10 PF (entidad Usuario - heredada)
- EI: 8 PF (login + registro)
- EQ: 3 PF (perfil)
- **Total:** 21 PF

**Endpoints:**
```
POST /auth/login
POST /auth/register
GET  /auth/profile
```

**Flujo de Autenticación:**
```
1. Usuario → POST /auth/login (email, password)
2. Backend valida credenciales + API Key
3. Backend retorna JWT token
4. Frontend almacena token en localStorage
5. Todas las peticiones incluyen:
   - Header X-API-Key: <api_key>
   - Header Authorization: Bearer <jwt_token>
```

---

## Arquitectura Técnica

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (PWA)                        │
│  Next.js 16 + React 19 + TailwindCSS + shadcn/ui       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Animales │  │  Lotes   │  │ Pesajes  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Titulares │  │Establec. │  │Movimien. │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  Estado: Zustand + TanStack Query                       │
│  Offline: Service Workers + IndexedDB (en desarrollo)   │
└─────────────────────────────────────────────────────────┘
                          ▼ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (API)                         │
│           NestJS + Prisma ORM + PostgreSQL              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Módulo Ganado (/api/v1/ganado/*)                │  │
│  │                                                   │  │
│  │  • AnimalesController                            │  │
│  │  • TitularesController                           │  │
│  │  • EstablecimientosController                    │  │
│  │  • LotesController                               │  │
│  │  • PesajesController                             │  │
│  │  • MovimientosController                         │  │
│  │  • DashboardController                           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Autenticación: JWT + Guards                            │
│  Validación: Class Validator + Zod                      │
│  Documentación: Swagger/OpenAPI                         │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL)                  │
│                   Supabase Managed                       │
│                                                          │
│  12 Tablas Principales:                                 │
│  • titular                                              │
│  • establecimiento                                      │
│  • animal                                               │
│  • identificador                                        │
│  • raza                                                 │
│  • lote                                                 │
│  • sesion_pesaje                                        │
│  • pesaje                                               │
│  • movimiento                                           │
│  • movimiento_detalle                                   │
│  • documento_ganado                                     │
│  • usuario                                              │
└─────────────────────────────────────────────────────────┘
```

### Modelo de Datos Relacional

```
Titular (1) ──────┐
                  │
                  ▼ (N)
            Establecimiento ──────┐
                  │               │
                  │               │
                  ▼ (N)           ▼ (N)
                Animal          Lote
                  │               │
                  ├──── (N) Identificador
                  │
                  ├──── (1) Raza
                  │
                  ├──── (N) Pesaje ──── (N) SesionPesaje
                  │
                  └──── (N) MovimientoDetalle ──── (1) Movimiento
                                                        │
                                                        └──── (N) DocumentoGanado
```

---

## Cálculo de Puntos de Función

### Metodología IFPUG 4.3

El cálculo se realizó siguiendo el estándar **IFPUG (International Function Point Users Group)**, clasificando las funciones en:

#### Funciones de Datos
- **ILF (Internal Logical Files):** Archivos lógicos internos
- **EIF (External Interface Files):** Archivos de interfaz externa

#### Funciones Transaccionales
- **EI (External Inputs):** Entradas que modifican datos
- **EO (External Outputs):** Salidas con lógica de negocio
- **EQ (External Queries):** Consultas simples

### Matriz de Complejidad

| Tipo | Baja | Media | Alta |
|------|------|-------|------|
| **ILF** | 7 PF | 10 PF | 15 PF |
| **EIF** | 5 PF | 7 PF | 10 PF |
| **EI** | 3 PF | 4 PF | 6 PF |
| **EO** | 4 PF | 5 PF | 7 PF |
| **EQ** | 3 PF | 4 PF | 6 PF |

### Resumen de Puntos de Función

#### Por Tipo de Función

| Tipo | Cantidad | PF Totales | Descripción |
|------|----------|------------|-------------|
| **ILF** | 12 | 109 | Entidades de datos gestionadas |
| **EIF** | 1 | 5 | Archivos XR5000 importados |
| **EI** | 31 | 117 | Operaciones de creación/actualización/eliminación |
| **EO** | 5 | 31 | Reportes y estadísticas con cálculos |
| **EQ** | 15 | 60 | Consultas de datos |
| **TOTAL** | **64** | **322 PFNA** | Puntos de Función No Ajustados |

#### Por Módulo Funcional

| Módulo | ILF | EIF | EI | EO | EQ | Total PF |
|--------|-----|-----|----|----|-------|----------|
| **Titulares** | 7 | 0 | 14 | 0 | 7 | 28 |
| **Establecimientos** | 10 | 0 | 14 | 0 | 7 | 31 |
| **Animales** | 22 | 0 | 18 | 7 | 10 | 57 |
| **Razas** | 7 | 0 | 9 | 0 | 7 | 23 |
| **Lotes** | 7 | 0 | 15 | 0 | 8 | 30 |
| **Pesajes** | 17 | 5 | 17 | 0 | 8 | 47 |
| **Movimientos** | 29 | 0 | 16 | 5 | 10 | 60 |
| **Dashboard** | 0 | 0 | 0 | 19 | 0 | 19 |
| **Autenticación** | 10 | 0 | 8 | 0 | 3 | 21 |
| **TOTAL** | **109** | **5** | **117** | **31** | **60** | **322** |

### Factor de Ajuste de Valor (VAF)

Se evaluaron 14 factores de influencia técnica:

| Factor | Grado (0-5) | Descripción |
|--------|-------------|-------------|
| Comunicación de datos | 4 | API REST, sincronización offline, XR5000 |
| Procesamiento distribuido | 3 | Frontend PWA + Backend separados |
| Rendimiento | 4 | Paginación, índices, caching |
| Configuración | 2 | Configuración moderada |
| Tasa de transacciones | 3 | Operaciones diarias en terreno |
| Entrada online | 5 | 100% operación web/móvil |
| Eficiencia usuario | 5 | UX optimizada, PWA offline-first |
| Actualización online | 4 | CRUD completo en todos los módulos |
| Procesamiento complejo | 4 | Lógica de movimientos, importación XR5000 |
| Reutilización | 3 | Componentes shadcn/ui, servicios NestJS |
| Facilidad instalación | 4 | PWA instalable, Docker-ready |
| Facilidad operación | 4 | Dashboard intuitivo, búsquedas avanzadas |
| Múltiples sitios | 2 | Despliegue único |
| Facilidad cambios | 4 | Arquitectura modular, TypeScript |
| **TOTAL (TDI)** | **51** | |

**Cálculo VAF:**
```
VAF = 0.65 + (TDI × 0.01)
VAF = 0.65 + (51 × 0.01)
VAF = 1.16
```

### Puntos de Función Ajustados (PFA)

```
PFA = PFNA × VAF
PFA = 322 × 1.16
PFA = 373.52 ≈ 374 PF
```

---

## Métricas del Proyecto

### Esfuerzo de Desarrollo

| Escenario | Horas/PF | Cálculo | Total Horas |
|-----------|----------|---------|-------------|
| **Optimista** | 5 h/PF | 374 × 5 | 1,870 h |
| **Realista** | 6 h/PF | 374 × 6 | **2,244 h** |
| **Conservador** | 7 h/PF | 374 × 7 | 2,618 h |

### Distribución por Fase

| Fase | % | Horas | Descripción |
|------|---|-------|-------------|
| Análisis y Diseño | 15% | 337 h | Requisitos, ERD, arquitectura |
| Desarrollo Backend | 30% | 673 h | API NestJS, Prisma, lógica |
| Desarrollo Frontend | 30% | 673 h | Next.js, componentes, PWA |
| Testing y QA | 15% | 337 h | Unitarias, integración, E2E |
| Deployment y Docs | 10% | 224 h | CI/CD, documentación |

### Valoración Económica

| Concepto | Valor |
|----------|-------|
| **Puntos de Función** | 374 PF |
| **Esfuerzo Estimado** | 2,244 horas |
| **Tarifa Promedio** | $50/hora |
| **Valor Base** | $112,200 |
| **Gestión de Proyecto (10%)** | $11,220 |
| **Infraestructura (5%)** | $5,610 |
| **Contingencia (10%)** | $11,220 |
| **Margen Comercial (15%)** | $16,830 |
| **INVERSIÓN TOTAL** | **$157,080 USD** |
| **Valor por PF** | **$420/PF** |

### Estado de Implementación

| Componente | Estado | % Completado |
|------------|--------|--------------|
| **Backend NestJS** | ✅ Completado | 100% |
| **Base de Datos** | ✅ Completado | 100% |
| **Autenticación** | ✅ Completado | 100% |
| **Frontend Core** | ✅ Completado | 90% |
| **Módulos CRUD** | ✅ Completado | 95% |
| **Dashboard** | ✅ Completado | 85% |
| **PWA Offline** | 🚧 En desarrollo | 40% |
| **Sincronización** | 🚧 En desarrollo | 30% |
| **Módulo Sanitario** | ⏳ Planificado | 0% |
| **Integración SIPEC** | ⏳ Planificado | 0% |
| **PROMEDIO GENERAL** | | **85%** |

### Cronograma

| Fase | Duración | Semanas |
|------|----------|---------|
| Finalización MVP | 4 semanas | 1-4 |
| PWA Offline | 6 semanas | 5-10 |
| Testing y QA | 3 semanas | 11-13 |
| Deployment | 2 semanas | 14-15 |
| Soporte Post-Lanzamiento | 4 semanas | 16-19 |
| **TOTAL** | **19 semanas** | **~4.5 meses** |

---

## Documentación Relacionada

### Documentos Técnicos

- **[CALCULO-PF-MI-GANADO.md](./CALCULO-PF-MI-GANADO.md)** - Cálculo detallado de Puntos de Función con metodología IFPUG
- **[ENV-CONFIG.md](./ENV-CONFIG.md)** - Configuración de variables de entorno
- **[CREDENCIALES-PRUEBA.md](./CREDENCIALES-PRUEBA.md)** - Credenciales para testing

### Documentos de Negocio

- **[PROPUESTA-SAAS-MI-GANADO.md](./PROPUESTA-SAAS-MI-GANADO.md)** - Propuesta comercial SaaS
- **[PROPUESTA-MARIA-AUAD-CLIENTE-FUNDADOR.md](./PROPUESTA-MARIA-AUAD-CLIENTE-FUNDADOR.md)** - Propuesta para cliente fundador

### Código Fuente

- **Frontend:** `/mi-ganado/src/`
- **Backend:** `/backend-agente/src/ganado/`
- **Base de Datos:** `/backend-agente/prisma/schema.prisma`

### APIs y Endpoints

- **Swagger UI:** `http://localhost:8089/api` (desarrollo)
- **Health Check:** `http://localhost:8089/health`

---

## Guía Rápida de Aplicación de Puntos de Función

### Paso 1: Identificar Funciones de Datos (ILF/EIF)

**ILF (Internal Logical Files):** Entidades gestionadas por el sistema

1. Contar **DET (Data Element Types):** Campos únicos de la entidad
2. Contar **RET (Record Element Types):** Subgrupos lógicos (generalmente 1-2)
3. Determinar complejidad:
   - **Baja:** DET ≤ 19 y RET = 1 → 7 PF
   - **Media:** DET 20-50 o RET = 2 → 10 PF
   - **Alta:** DET > 50 o RET ≥ 3 → 15 PF

**Ejemplo - Animal:**
- DET: 18 campos (especie, sexo, categoría, fechas, etc.)
- RET: 4 (datos básicos, trazabilidad, ubicación, relaciones)
- Complejidad: **Alta** → **15 PF**

### Paso 2: Identificar Funciones Transaccionales (EI/EO/EQ)

**EI (External Inputs):** Operaciones que modifican datos

1. Contar **DET:** Campos de entrada + mensajes de respuesta
2. Contar **FTR (File Types Referenced):** Archivos lógicos afectados
3. Determinar complejidad:
   - **Baja:** DET ≤ 15 y FTR ≤ 2 → 3 PF
   - **Media:** DET 16-25 o FTR = 3 → 4 PF
   - **Alta:** DET > 25 o FTR ≥ 4 → 6 PF

**Ejemplo - POST /animales:**
- DET: 18 campos entrada + 5 respuesta = 23
- FTR: 4 (Animal, Identificador, Establecimiento, Raza)
- Complejidad: **Alta** → **6 PF**

**EO (External Outputs):** Salidas con lógica de negocio o cálculos

- Similar a EI, pero evalúa campos de salida y agregaciones
- Dashboard con múltiples conteos: **Alta** → **7 PF**

**EQ (External Queries):** Consultas simples sin procesamiento complejo

- Similar a EO, pero sin cálculos complejos
- GET simple con filtros: **Media** → **4 PF**

### Paso 3: Calcular PFNA

```
PFNA = Σ(ILF) + Σ(EIF) + Σ(EI) + Σ(EO) + Σ(EQ)
```

### Paso 4: Evaluar Factores de Influencia (TDI)

Calificar 14 factores de 0 (sin influencia) a 5 (influencia fuerte):

1. Comunicación de datos
2. Procesamiento distribuido
3. Rendimiento
4. Configuración altamente utilizada
5. Tasa de transacciones
6. Entrada de datos en línea
7. Eficiencia del usuario final
8. Actualización en línea
9. Procesamiento complejo
10. Reutilización
11. Facilidad de instalación
12. Facilidad de operación
13. Múltiples sitios
14. Facilidad de cambios

```
TDI = Σ(grados de influencia)
```

### Paso 5: Calcular VAF y PFA

```
VAF = 0.65 + (TDI × 0.01)
PFA = PFNA × VAF
```

### Paso 6: Estimar Esfuerzo

```
Horas = PFA × Factor de Productividad (5-7 h/PF)
```

### Paso 7: Valorar Económicamente

```
Valor = Horas × Tarifa/Hora × Factor de Margen (1.4 - 1.5)
```

---

## Contacto y Soporte

Para más información sobre el sistema o el cálculo de puntos de función:

- **Documentación Técnica:** Ver `/docs/`
- **Código Fuente:** GitHub (privado)
- **Soporte:** Equipo de Desarrollo Mi Ganado

---

**Última actualización:** 4 de Febrero 2026  
**Versión del documento:** 1.0.0

---

*Este documento es confidencial y está destinado exclusivamente para uso interno del proyecto Mi Ganado.*
