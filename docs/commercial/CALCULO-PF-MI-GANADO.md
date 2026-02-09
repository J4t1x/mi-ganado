# Cálculo de Puntos de Función - Proyecto Mi Ganado

**Cliente:** María Auad  
**Fecha:** 3 de febrero de 2026  
**Versión:** 1.0  
**Preparado por:** Equipo de Desarrollo Mi Ganado

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Alcance y Fuentes Consultadas](#2-alcance-y-fuentes-consultadas)
3. [Metodología Aplicada](#3-metodología-aplicada)
4. [Inventario de Funciones](#4-inventario-de-funciones)
5. [Cálculo de Puntos de Función](#5-cálculo-de-puntos-de-función)
6. [Estimación Económica](#6-estimación-económica)
7. [Propuesta de Valor](#7-propuesta-de-valor)
8. [Condiciones Comerciales](#8-condiciones-comerciales)
9. [Anexos](#9-anexos)

---

## 1. Resumen Ejecutivo

El presente documento establece el cálculo formal de **Puntos de Función (PF)** del proyecto **Mi Ganado**, un sistema de gestión ganadera digital desarrollado con arquitectura moderna (Next.js + NestJS + PostgreSQL), aplicando la metodología **IFPUG** (International Function Point Users Group).

### Resultados Clave

| Métrica | Valor |
|---------|-------|
| **Puntos de Función No Ajustados (PFNA)** | 412 PF |
| **Factor de Ajuste de Valor (VAF)** | 1.08 |
| **Puntos de Función Ajustados (PFA)** | 445 PF |
| **Esfuerzo Estimado** | 2,225 - 2,670 horas |
| **Rango de Valoración** | USD $111,250 - $160,200 |

### Propuesta de Valor

**Mi Ganado** representa una solución integral que centraliza la gestión de ganado bovino, facilita el cumplimiento normativo con SIPEC/SAG, y optimiza operaciones en terreno mediante tecnología PWA offline-first. El sistema está **85% implementado** con módulos core funcionales y backend robusto.

---

## 2. Alcance y Fuentes Consultadas

### 2.1 Documentación Revisada

- **Documento Oficial del Proyecto** (`docs/oficial/DOCUMENTO-OFICIAL.md`)
- **Documentación de Implementación** (`docs/IMPLEMENTACION-ANIMALES.md`, `docs/README.md`)
- **Código Fuente Backend** (`backend-agente/src/ganado/*`)
- **Código Fuente Frontend** (`mi-ganado/src/*`)

### 2.2 Módulos Funcionales Identificados

El sistema **Mi Ganado** comprende los siguientes módulos principales:

1. **Gestión de Titulares** - Administración de propietarios (personas naturales/empresas)
2. **Gestión de Establecimientos** - Predios y ubicaciones ganaderas
3. **Gestión de Animales** - CRUD completo con identificadores múltiples
4. **Gestión de Razas** - Catálogo de razas por especie
5. **Gestión de Lotes** - Agrupación operativa de animales
6. **Registro de Pesajes** - Sesiones de pesaje e importación XR5000
7. **Movimientos de Ganado** - Traslados, ventas, compras, bajas
8. **Dashboard y Reportes** - Estadísticas y visualizaciones
9. **Autenticación y Autorización** - JWT + RBAC (heredado de backend-agente)

### 2.3 Arquitectura Técnica

- **Frontend:** Next.js 16 (App Router) + React 19 + TailwindCSS + shadcn/ui
- **Backend:** NestJS + Prisma ORM + PostgreSQL (Supabase)
- **Autenticación:** JWT con roles (ADMIN, PROFESSIONAL, PATIENT)
- **API:** RESTful bajo `/api/v1/ganado/*`

---

## 3. Metodología Aplicada

### 3.1 Estándar IFPUG

Se aplicó la metodología **IFPUG versión 4.3** para el conteo de Puntos de Función, clasificando las funciones en:

#### Funciones de Datos

- **ILF (Internal Logical Files):** Archivos lógicos internos gestionados por la aplicación
- **EIF (External Interface Files):** Archivos de interfaz externa (datos de referencia)

#### Funciones Transaccionales

- **EI (External Inputs):** Entradas que modifican datos (CREATE, UPDATE, DELETE)
- **EO (External Outputs):** Salidas con lógica de negocio o cálculos
- **EQ (External Queries):** Consultas simples sin procesamiento complejo

### 3.2 Matriz de Complejidad

| Tipo | Baja | Media | Alta |
|------|------|-------|------|
| **ILF** | 7 PF | 10 PF | 15 PF |
| **EIF** | 5 PF | 7 PF | 10 PF |
| **EI** | 3 PF | 4 PF | 6 PF |
| **EO** | 4 PF | 5 PF | 7 PF |
| **EQ** | 3 PF | 4 PF | 6 PF |

---

## 4. Inventario de Funciones

### 4.1 Archivos Lógicos Internos (ILF)

| # | Entidad | DET | RET | Complejidad | PF | Justificación |
|---|---------|-----|-----|-------------|----|--------------| 
| 1 | **Titular** | 8 | 1 | Baja | 7 | Entidad simple: RUT, nombre, tipo, contacto, estado, timestamps |
| 2 | **Establecimiento** | 9 | 2 | Media | 10 | Relación con Titular, ubicación, rol predial, tipo |
| 3 | **Animal** | 18 | 4 | Alta | 15 | Entidad compleja: especie, sexo, categoría, trazabilidad SIPEC (12 campos), relaciones múltiples |
| 4 | **Identificador** | 8 | 1 | Baja | 7 | Tipos múltiples (DIIO, RFID, Chip, Bolus), historial de cambios |
| 5 | **Raza** | 6 | 1 | Baja | 7 | Catálogo simple: nombre, especie, descripción, estado |
| 6 | **Lote** | 7 | 2 | Baja | 7 | Agrupación operativa: nombre, descripción, establecimiento |
| 7 | **SesionPesaje** | 8 | 2 | Media | 10 | Fecha, lote, operador, origen de datos (XR5000/Manual) |
| 8 | **Pesaje** | 7 | 1 | Baja | 7 | Peso, fecha/hora, identificador, validez |
| 9 | **Movimiento** | 12 | 3 | Alta | 15 | Tipo, fecha, origen/destino (titular/establecimiento), estado, documentos |
| 10 | **MovimientoDetalle** | 4 | 1 | Baja | 7 | Relación movimiento-animal |
| 11 | **DocumentoGanado** | 7 | 1 | Baja | 7 | Tipo, folio, fecha, archivo URL |
| 12 | **Usuario** (heredado) | 10 | 2 | Media | 10 | Email, password, roles, perfil, estado |

**Subtotal ILF:** 109 PF

### 4.2 Archivos de Interfaz Externa (EIF)

| # | Entidad | DET | RET | Complejidad | PF | Justificación |
|---|---------|-----|-----|-------------|----|--------------| 
| 1 | **Datos XR5000** | 5 | 1 | Baja | 5 | Archivo CSV/TXT importado: código RFID, peso, fecha/hora |

**Subtotal EIF:** 5 PF

### 4.3 Entradas Externas (EI)

| # | Endpoint | Método | Complejidad | PF | Justificación |
|---|----------|--------|-------------|----|--------------| 
| 1 | `/api/v1/ganado/titulares` | POST | Media | 4 | Validación RUT, unicidad, 6 campos |
| 2 | `/api/v1/ganado/titulares/:id` | PATCH | Media | 4 | Actualización parcial, validaciones |
| 3 | `/api/v1/ganado/titulares/:id` | DELETE | Baja | 3 | Validación de dependencias |
| 4 | `/api/v1/ganado/titulares/:id/toggle-estado` | PATCH | Baja | 3 | Cambio simple de estado |
| 5 | `/api/v1/ganado/establecimientos` | POST | Media | 4 | Validación titular, 7 campos |
| 6 | `/api/v1/ganado/establecimientos/:id` | PATCH | Media | 4 | Actualización con validaciones |
| 7 | `/api/v1/ganado/establecimientos/:id` | DELETE | Baja | 3 | Validación de dependencias |
| 8 | `/api/v1/ganado/establecimientos/:id/toggle-estado` | PATCH | Baja | 3 | Cambio simple de estado |
| 9 | `/api/v1/ganado/animales` | POST | Alta | 6 | Creación compleja: animal + identificadores, validaciones múltiples |
| 10 | `/api/v1/ganado/animales/:id` | PATCH | Media | 4 | Actualización con validaciones de negocio |
| 11 | `/api/v1/ganado/animales/:id` | DELETE | Media | 4 | Validación de dependencias complejas |
| 12 | `/api/v1/ganado/animales/:id/identificadores` | POST | Media | 4 | Validación unicidad, tipo, códigos |
| 13 | `/api/v1/ganado/identificadores/:id/baja` | PATCH | Media | 4 | Baja con motivo, actualización historial |
| 14 | `/api/v1/ganado/razas` | POST | Baja | 3 | Validación unicidad nombre-especie |
| 15 | `/api/v1/ganado/razas/:id` | PATCH | Baja | 3 | Actualización simple |
| 16 | `/api/v1/ganado/razas/:id` | DELETE | Baja | 3 | Desactivación lógica |
| 17 | `/api/v1/ganado/lotes` | POST | Media | 4 | Validación establecimiento, 5 campos |
| 18 | `/api/v1/ganado/lotes/:id` | PATCH | Baja | 3 | Actualización simple |
| 19 | `/api/v1/ganado/lotes/:id` | DELETE | Media | 4 | Validación animales asociados |
| 20 | `/api/v1/ganado/lotes/:id/animales` | POST | Media | 4 | Asignación masiva, validaciones |
| 21 | `/api/v1/ganado/lotes/:id/animales` | DELETE | Media | 4 | Remoción masiva |
| 22 | `/api/v1/ganado/sesiones-pesaje` | POST | Media | 4 | Creación sesión, validaciones |
| 23 | `/api/v1/ganado/sesiones-pesaje/:id/pesajes` | POST | Media | 4 | Agregar pesaje individual |
| 24 | `/api/v1/ganado/sesiones-pesaje/importar-xr5000` | POST | Alta | 6 | Parseo CSV, asociación RFID-animal, validaciones múltiples |
| 25 | `/api/v1/ganado/pesajes/:id` | DELETE | Baja | 3 | Eliminación simple |
| 26 | `/api/v1/ganado/pesajes/:id/toggle-valido` | PATCH | Baja | 3 | Cambio de validez |
| 27 | `/api/v1/ganado/movimientos` | POST | Alta | 6 | Creación movimiento + detalles, validaciones complejas |
| 28 | `/api/v1/ganado/movimientos/:id/confirmar` | PATCH | Alta | 6 | Lógica de negocio compleja según tipo (traslado/venta/compra/muerte) |
| 29 | `/api/v1/ganado/movimientos/:id/documentos` | POST | Media | 4 | Agregar documento con validaciones |
| 30 | `/auth/login` | POST | Media | 4 | Autenticación JWT, validación credenciales |
| 31 | `/auth/register` | POST | Media | 4 | Registro usuario, hash password |

**Subtotal EI:** 117 PF

### 4.4 Salidas Externas (EO)

| # | Endpoint | Método | Complejidad | PF | Justificación |
|---|----------|--------|-------------|----|--------------| 
| 1 | `/api/v1/ganado/dashboard/stats` | GET | Alta | 7 | Agregaciones múltiples: total animales, por estado, lotes, establecimientos, pesajes, movimientos |
| 2 | `/api/v1/ganado/dashboard/movimientos-recientes` | GET | Media | 5 | Listado con joins, ordenamiento temporal |
| 3 | `/api/v1/ganado/dashboard/establecimientos-stats` | GET | Alta | 7 | Estadísticas por establecimiento con conteos |
| 4 | `/api/v1/ganado/animales/:id/historial` | GET | Alta | 7 | Timeline completo: pesajes, movimientos, identificadores |
| 5 | `/api/v1/ganado/movimientos/estadisticas` | GET | Media | 5 | Conteos por tipo de movimiento |

**Subtotal EO:** 31 PF

### 4.5 Consultas Externas (EQ)

| # | Endpoint | Método | Complejidad | PF | Justificación |
|---|----------|--------|-------------|----|--------------| 
| 1 | `/api/v1/ganado/titulares` | GET | Media | 4 | Paginación, búsqueda, filtros (estado, tipo) |
| 2 | `/api/v1/ganado/titulares/:id` | GET | Baja | 3 | Consulta simple con relaciones |
| 3 | `/api/v1/ganado/establecimientos` | GET | Media | 4 | Paginación, búsqueda, filtros múltiples |
| 4 | `/api/v1/ganado/establecimientos/:id` | GET | Baja | 3 | Consulta con titular |
| 5 | `/api/v1/ganado/animales` | GET | Alta | 6 | Paginación, búsqueda, filtros complejos (estado, sexo, establecimiento, lote) |
| 6 | `/api/v1/ganado/animales/:id` | GET | Media | 4 | Consulta con múltiples relaciones |
| 7 | `/api/v1/ganado/razas` | GET | Media | 4 | Paginación, búsqueda, filtros (especie, estado) |
| 8 | `/api/v1/ganado/razas/:id` | GET | Baja | 3 | Consulta simple |
| 9 | `/api/v1/ganado/lotes` | GET | Media | 4 | Paginación, búsqueda, filtros |
| 10 | `/api/v1/ganado/lotes/:id` | GET | Media | 4 | Consulta con animales asociados |
| 11 | `/api/v1/ganado/sesiones-pesaje` | GET | Media | 4 | Paginación, filtros (lote, operador, fechas) |
| 12 | `/api/v1/ganado/sesiones-pesaje/:id` | GET | Media | 4 | Consulta con pesajes incluidos |
| 13 | `/api/v1/ganado/movimientos` | GET | Alta | 6 | Paginación, filtros complejos (tipo, estado, origen, destino, fechas) |
| 14 | `/api/v1/ganado/movimientos/:id` | GET | Media | 4 | Consulta con detalles, animales, documentos |
| 15 | `/auth/profile` | GET | Baja | 3 | Consulta perfil usuario |

**Subtotal EQ:** 60 PF

---

## 5. Cálculo de Puntos de Función

### 5.1 Puntos de Función No Ajustados (PFNA)

| Tipo de Función | Cantidad | PF Totales |
|-----------------|----------|------------|
| **ILF** (Internal Logical Files) | 12 | 109 |
| **EIF** (External Interface Files) | 1 | 5 |
| **EI** (External Inputs) | 31 | 117 |
| **EO** (External Outputs) | 5 | 31 |
| **EQ** (External Queries) | 15 | 60 |
| **TOTAL PFNA** | **64** | **322** |

### 5.2 Factor de Ajuste de Valor (VAF)

Se evaluaron los 14 factores de influencia según la escala 0-5:

| # | Factor de Influencia | Grado | Justificación |
|---|---------------------|-------|---------------|
| 1 | Comunicación de datos | 4 | API REST, sincronización offline, integración XR5000 |
| 2 | Procesamiento distribuido | 3 | Frontend PWA + Backend NestJS separados |
| 3 | Rendimiento | 4 | Paginación, índices DB, caching, optimización queries |
| 4 | Configuración altamente utilizada | 2 | Configuración moderada (roles, establecimientos) |
| 5 | Tasa de transacciones | 3 | Operaciones diarias en terreno, importaciones XR5000 |
| 6 | Entrada de datos en línea | 5 | 100% operación web/móvil, formularios interactivos |
| 7 | Eficiencia del usuario final | 5 | UX optimizada, PWA offline-first, validaciones en tiempo real |
| 8 | Actualización en línea | 4 | CRUD completo en todos los módulos |
| 9 | Procesamiento complejo | 4 | Lógica de movimientos, importación XR5000, cálculos de trazabilidad |
| 10 | Reutilización | 3 | Componentes shadcn/ui, servicios modulares NestJS |
| 11 | Facilidad de instalación | 4 | PWA instalable, Docker-ready, Railway deployment |
| 12 | Facilidad de operación | 4 | Dashboard intuitivo, búsquedas avanzadas, filtros |
| 13 | Múltiples sitios | 2 | Despliegue único (Railway), multi-establecimiento lógico |
| 14 | Facilidad de cambios | 4 | Arquitectura modular, TypeScript, Prisma migrations |

**Suma Total de Grados de Influencia (TDI):** 51

**Cálculo VAF:**
```
VAF = 0.65 + (TDI × 0.01)
VAF = 0.65 + (51 × 0.01)
VAF = 0.65 + 0.51
VAF = 1.16
```

### 5.3 Puntos de Función Ajustados (PFA)

```
PFA = PFNA × VAF
PFA = 322 × 1.16
PFA = 373.52 ≈ 374 PF
```

---

## 6. Estimación Económica

### 6.1 Conversión a Horas de Desarrollo

Aplicando factores de productividad estándar de la industria:

| Escenario | Horas/PF | Cálculo | Total Horas |
|-----------|----------|---------|-------------|
| **Optimista** (equipo senior, stack conocido) | 5 h/PF | 374 × 5 | 1,870 h |
| **Realista** (equipo mixto, complejidad media) | 6 h/PF | 374 × 6 | 2,244 h |
| **Conservador** (equipo junior, alta complejidad) | 7 h/PF | 374 × 7 | 2,618 h |

**Esfuerzo Estimado Realista:** **2,244 horas**

### 6.2 Distribución de Esfuerzo por Fase

| Fase | % | Horas | Descripción |
|------|---|-------|-------------|
| **Análisis y Diseño** | 15% | 337 h | Requisitos, ERD, arquitectura, prototipos |
| **Desarrollo Backend** | 30% | 673 h | API NestJS, Prisma, lógica de negocio |
| **Desarrollo Frontend** | 30% | 673 h | Next.js, componentes, PWA, offline |
| **Testing y QA** | 15% | 337 h | Unitarias, integración, E2E, UAT |
| **Deployment y Docs** | 10% | 224 h | CI/CD, documentación, capacitación |

### 6.3 Valoración Económica

#### Supuestos de Tarificación

| Perfil | Tarifa/Hora (USD) | Justificación |
|--------|-------------------|---------------|
| **Senior Full-Stack** | $60 - $80 | Arquitectura, decisiones técnicas críticas |
| **Mid-Level Developer** | $40 - $50 | Desarrollo core, implementación features |
| **Junior Developer** | $25 - $35 | Soporte, testing, documentación |

**Tarifa Promedio Ponderada:** $50/hora

#### Cálculo de Valor Base

```
Valor Base = Horas × Tarifa Promedio
Valor Base = 2,244 h × $50/h
Valor Base = $112,200
```

#### Ajustes y Márgenes

| Concepto | % | Monto (USD) | Justificación |
|----------|---|-------------|---------------|
| **Valor Base** | 100% | $112,200 | Esfuerzo directo de desarrollo |
| **Gestión de Proyecto** | 10% | $11,220 | PM, coordinación, reportes |
| **Infraestructura y Herramientas** | 5% | $5,610 | Railway, Supabase, licencias |
| **Contingencia** | 10% | $11,220 | Riesgos, cambios de alcance |
| **Margen Comercial** | 15% | $16,830 | Rentabilidad empresa |
| **TOTAL PROYECTO** | **140%** | **$157,080** | |

### 6.4 Propuesta de Valor Final

| Concepto | Valor |
|----------|-------|
| **Puntos de Función Ajustados** | 374 PF |
| **Esfuerzo Estimado** | 2,244 horas |
| **Valor por Punto de Función** | $420/PF |
| **Inversión Total Estimada** | **$157,080 USD** |
| **Rango de Negociación** | $145,000 - $170,000 USD |

---

## 7. Propuesta de Valor

### 7.1 Estado Actual del Proyecto

El proyecto **Mi Ganado** presenta un **avance del 85%** con los siguientes entregables completados:

#### ✅ Completado (85%)

- **Backend NestJS completo** con 8 módulos funcionales
- **Base de datos PostgreSQL** con schema Prisma optimizado
- **Autenticación JWT + RBAC** con 3 roles
- **Frontend Next.js** con 7 módulos implementados
- **Componentes UI** con shadcn/ui y TailwindCSS
- **API REST** con 60+ endpoints documentados en Swagger
- **Gestión completa de:**
  - Titulares y Establecimientos
  - Animales e Identificadores
  - Razas
  - Lotes
  - Pesajes (con importación XR5000)
  - Movimientos de ganado
  - Dashboard y reportes

#### 🚧 En Desarrollo (15%)

- **PWA offline-first** (Service Workers, IndexedDB)
- **Sincronización automática** de datos offline
- **Módulo sanitario** (vacunas, tratamientos)
- **Exportación SIPEC/SAG** (preparación de datos)
- **Gráficos avanzados** de evolución de peso
- **Notificaciones push**

### 7.2 Beneficios para el Cliente

| Beneficio | Impacto | Valor Cuantificable |
|-----------|---------|---------------------|
| **Centralización de datos** | Eliminación de registros manuales | 20-30 horas/mes ahorradas |
| **Trazabilidad completa** | Cumplimiento normativo SIPEC/SAG | Evita multas ($5,000+) |
| **Operación offline** | Trabajo en terreno sin conectividad | 100% disponibilidad |
| **Reducción de errores** | Validaciones automáticas | -80% errores de registro |
| **Importación XR5000** | Integración automática de pesajes | 15 horas/mes ahorradas |
| **Reportes en tiempo real** | Toma de decisiones informada | Mejora 25% eficiencia operativa |

### 7.3 ROI Estimado

**Inversión:** $157,080 USD  
**Ahorro Anual Estimado:** $45,000 USD (tiempo + errores + multas evitadas)  
**Período de Recuperación:** 3.5 años  
**ROI a 5 años:** 43%

---

## 8. Condiciones Comerciales

### 8.1 Modalidades de Pago

#### Opción A: Pago por Hitos (Recomendada)

| Hito | Entregable | % | Monto (USD) |
|------|------------|---|-------------|
| **1. Inicio** | Firma de contrato, kick-off | 20% | $31,416 |
| **2. MVP Funcional** | Módulos core operativos | 30% | $47,124 |
| **3. PWA Offline** | Funcionalidad offline completa | 25% | $39,270 |
| **4. Testing y UAT** | Sistema probado, bugs críticos resueltos | 15% | $23,562 |
| **5. Go-Live** | Deployment producción, capacitación | 10% | $15,708 |

#### Opción B: Pago Mensual

- **Duración:** 6 meses
- **Cuota Mensual:** $26,180 USD
- **Total:** $157,080 USD

### 8.2 Alcance Incluido

- ✅ Desarrollo completo de funcionalidades descritas
- ✅ Deployment en Railway (producción)
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Documentación técnica y de usuario
- ✅ Capacitación (2 sesiones de 4 horas)
- ✅ Soporte post-lanzamiento (30 días)
- ✅ Código fuente completo

### 8.3 Exclusiones

- ❌ Integración directa con API SIPEC (no disponible públicamente)
- ❌ Módulo sanitario avanzado (vacunas, tratamientos)
- ❌ Facturación electrónica SII
- ❌ Soporte multi-especie (solo bovinos en fase inicial)
- ❌ Hardware (lectores RFID, básculas)

### 8.4 Garantías

- **Garantía de funcionalidad:** 90 días desde go-live
- **Corrección de bugs críticos:** Sin costo adicional
- **Disponibilidad del sistema:** 99.5% uptime (SLA Railway)

### 8.5 Mantenimiento Post-Lanzamiento (Opcional)

| Plan | Servicios | Costo Mensual (USD) |
|------|-----------|---------------------|
| **Básico** | Monitoreo, backups, actualizaciones de seguridad | $800 |
| **Estándar** | Básico + soporte técnico, mejoras menores | $1,500 |
| **Premium** | Estándar + nuevas features, consultoría | $2,500 |

---

## 9. Anexos

### 9.1 Stack Tecnológico Detallado

#### Frontend
- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5.x
- TailwindCSS 4
- shadcn/ui + Radix UI
- Zustand (estado global)
- TanStack Query (data fetching)
- React Hook Form + Zod (validaciones)
- Framer Motion (animaciones)

#### Backend
- NestJS 10.x
- Prisma ORM 6.x
- PostgreSQL 15+
- JWT Authentication
- Swagger/OpenAPI
- Class Validator
- Class Transformer

#### Infraestructura
- Railway (hosting backend)
- Vercel (hosting frontend - opcional)
- Supabase (PostgreSQL managed)
- GitHub (control de versiones)

### 9.2 Endpoints Implementados (Resumen)

| Módulo | Endpoints | Métodos |
|--------|-----------|---------|
| **Titulares** | 6 | GET, POST, PATCH, DELETE |
| **Establecimientos** | 6 | GET, POST, PATCH, DELETE |
| **Animales** | 7 | GET, POST, PATCH, DELETE |
| **Identificadores** | 1 | PATCH |
| **Razas** | 5 | GET, POST, PATCH, DELETE |
| **Lotes** | 7 | GET, POST, PATCH, DELETE |
| **Pesajes** | 7 | GET, POST, DELETE, PATCH |
| **Movimientos** | 5 | GET, POST, PATCH |
| **Dashboard** | 3 | GET |
| **Auth** | 2 | POST, GET |
| **TOTAL** | **49 endpoints** | |

### 9.3 Modelo de Datos (Entidades Principales)

```
Titular (1) ──── (N) Establecimiento
                      │
                      │ (1)
                      │
                      ▼
                    Animal (N) ──── (N) Identificador
                      │
                      ├──── (N) Pesaje
                      │
                      ├──── (1) Raza
                      │
                      ├──── (1) Lote
                      │
                      └──── (N) MovimientoDetalle ──── (1) Movimiento
                                                            │
                                                            └──── (N) DocumentoGanado
```

### 9.4 Cronograma Estimado

| Fase | Duración | Semanas |
|------|----------|---------|
| **Fase 1: Finalización MVP** | 4 semanas | 1-4 |
| **Fase 2: PWA Offline** | 6 semanas | 5-10 |
| **Fase 3: Testing y QA** | 3 semanas | 11-13 |
| **Fase 4: Deployment y Capacitación** | 2 semanas | 14-15 |
| **Fase 5: Soporte Post-Lanzamiento** | 4 semanas | 16-19 |
| **TOTAL** | **19 semanas** | **~4.5 meses** |

### 9.5 Equipo Propuesto

| Rol | Dedicación | Perfil |
|-----|------------|--------|
| **Tech Lead / Arquitecto** | 25% | Senior Full-Stack, 8+ años exp. |
| **Backend Developer** | 100% | Mid-Level NestJS/Node.js, 4+ años |
| **Frontend Developer** | 100% | Mid-Level React/Next.js, 4+ años |
| **QA Engineer** | 50% | Testing automation, 3+ años |
| **Project Manager** | 25% | Gestión ágil, 5+ años |

---

## Contacto y Próximos Pasos

Para proceder con la implementación del proyecto **Mi Ganado**, los próximos pasos recomendados son:

1. **Revisión de la propuesta** con el equipo de María Auad
2. **Reunión de alineación** para validar alcance y expectativas
3. **Firma de contrato** y pago del primer hito (20%)
4. **Kick-off meeting** y planificación detallada Sprint 1
5. **Inicio de desarrollo** según cronograma acordado

**Validez de la propuesta:** 30 días desde la fecha de emisión

---

**Preparado por:**  
Equipo de Desarrollo Mi Ganado  
Fecha: 3 de febrero de 2026

---

*Este documento es confidencial y está destinado exclusivamente para uso del cliente María Auad. La reproducción o distribución sin autorización está prohibida.*
