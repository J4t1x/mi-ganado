# Módulos y Funcionalidades del Sistema Mi Ganado

**Versión:** 1.0.0  
**Fecha:** 5 de Febrero 2026  
**Propósito:** Documento maestro para planificación y gestión del desarrollo

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Módulos Implementados](#módulos-implementados)
4. [Módulos en Desarrollo](#módulos-en-desarrollo)
5. [Módulos Planificados](#módulos-planificados)
6. [Entidades del Sistema](#entidades-del-sistema)
7. [Integraciones Actuales](#integraciones-actuales)
8. [Integraciones Pendientes](#integraciones-pendientes)
9. [Roadmap de Desarrollo](#roadmap-de-desarrollo)

---

## Resumen Ejecutivo

**Mi Ganado** es una plataforma web progresiva (PWA) para la gestión integral de ganado bovino en Chile. El sistema permite centralizar, trazar y gestionar toda la información del ganado, facilitando el cumplimiento normativo con SIPEC/SAG.

### Estado Actual del Sistema

- **Módulos Completados:** 7/10 (70%)
- **Funcionalidades Core:** Implementadas
- **Integraciones Externas:** 1/5 (20%)
- **Modo Offline:** En desarrollo (40%)

---

## Arquitectura General

### Stack Tecnológico

#### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3 + TailwindCSS 4
- **Componentes:** shadcn/ui + Radix UI
- **Estado:** Zustand + TanStack Query
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React

#### Backend
- **API:** NestJS (backend-agente)
- **Base de datos:** PostgreSQL + Prisma ORM
- **Autenticación:** JWT + RBAC
- **Hosting:** Railway (producción)

### Estructura de Carpetas

```
mi-ganado/
├── src/
│   ├── app/                      # Rutas de Next.js
│   │   ├── (auth)/               # Autenticación
│   │   └── dashboard/            # Módulos principales
│   │       ├── animales/         # ✅ Gestión de animales
│   │       ├── configuracion/    # ✅ Titulares y establecimientos
│   │       ├── lotes/            # ✅ Gestión de lotes
│   │       ├── movimientos/      # ✅ Movimientos de ganado
│   │       ├── pesajes/          # ✅ Registro de pesajes
│   │       └── reportes/         # ✅ Reportes y estadísticas
│   ├── components/               # Componentes React
│   ├── lib/api/                  # Servicios de API
│   ├── services/                 # Servicios especializados
│   │   ├── offline/              # 🚧 Modo offline
│   │   ├── sync/                 # 🚧 Sincronización
│   │   └── xr5000/               # 🚧 Integración XR5000
│   ├── stores/                   # Estado global (Zustand)
│   └── types/                    # Tipos TypeScript
```

---

## Módulos Implementados

### 1. 🟢 Módulo de Autenticación

**Estado:** ✅ Completado  
**Prioridad:** Crítica

#### Funcionalidades Implementadas
- ✅ Login con email/password
- ✅ Validación de credenciales
- ✅ Gestión de tokens JWT
- ✅ Protección de rutas (AuthGuard)
- ✅ Perfil de usuario
- ✅ Logout

#### Archivos Principales
- `src/app/(auth)/login/page.tsx`
- `src/components/auth/auth-guard.tsx`
- `src/lib/api/auth-client.ts`
- `src/lib/api/server-actions.ts`

#### Funcionalidades Faltantes
- ❌ Recuperación de contraseña
- ❌ Cambio de contraseña
- ❌ Autenticación de dos factores (2FA)
- ❌ Gestión de sesiones múltiples
- ❌ Registro de nuevos usuarios (admin)

#### Atributos Faltantes en Entidad User
- `lastLogin: Date`
- `passwordResetToken: string?`
- `passwordResetExpires: Date?`
- `twoFactorEnabled: boolean`
- `twoFactorSecret: string?`

---

### 2. 🟢 Módulo de Gestión de Animales

**Estado:** ✅ Completado (Core)  
**Prioridad:** Crítica

#### Funcionalidades Implementadas
- ✅ Listado con paginación (10, 25, 50, 100 items)
- ✅ Búsqueda por identificadores
- ✅ Filtros avanzados (especie, sexo, estado, establecimiento, lote)
- ✅ Creación de animales con múltiples identificadores
- ✅ Edición de datos básicos
- ✅ Visualización detallada
- ✅ Historial de eventos
- ✅ Eliminación con confirmación
- ✅ Gestión de identificadores (DIIO, RFID, Chip, Bolus)
- ✅ Baja de identificadores con motivo

#### Archivos Principales
- `src/app/dashboard/animales/page.tsx`
- `src/app/dashboard/animales/[id]/page.tsx`
- `src/app/dashboard/animales/nuevo/page.tsx`
- `src/components/animales/animal-form.tsx`
- `src/lib/api/animales.ts`

#### Funcionalidades Faltantes
- ❌ Importación masiva desde Excel/CSV
- ❌ Exportación de listados
- ❌ Fotografías de animales
- ❌ Genealogía (padre/madre)
- ❌ Cálculo automático de categoría por edad
- ❌ Alertas de eventos importantes (vacunas, partos)
- ❌ Historial de ubicaciones
- ❌ Gráficos de evolución de peso
- ❌ Comparación entre animales

#### Atributos Faltantes en Entidad Animal
```typescript
// Genealogía
padreId?: string;
madreId?: string;

// Media
fotoPrincipal?: string;
fotos?: string[];

// Productividad
pesoNacimiento?: number;
pesoDestete?: number;
pesoActual?: number;
ultimoPesaje?: Date;
gdp?: number; // Ganancia diaria de peso

// Sanitario
ultimaVacunacion?: Date;
proximaVacunacion?: Date;
enTratamiento?: boolean;

// Reproductivo (para hembras)
gestante?: boolean;
fechaUltimoParto?: Date;
numeroParto?: number;

// Comercial
valorCompra?: number;
valorEstimado?: number;
costoAcumulado?: number;
```

---

### 3. 🟢 Módulo de Titulares

**Estado:** ✅ Completado  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ CRUD completo de titulares
- ✅ Validación de RUT chileno
- ✅ Tipos: Persona Natural / Empresa
- ✅ Gestión de estado (activo/inactivo)
- ✅ Toggle de estado
- ✅ Asociación con establecimientos
- ✅ Contador de establecimientos y animales
- ✅ Búsqueda y filtros

#### Archivos Principales
- `src/app/dashboard/configuracion/titulares/page.tsx`
- `src/components/titulares/titular-form.tsx`
- `src/lib/api/titulares.ts`

#### Funcionalidades Faltantes
- ❌ Historial de cambios
- ❌ Documentos asociados (escrituras, contratos)
- ❌ Múltiples contactos por titular
- ❌ Integración con SII para validación de RUT
- ❌ Representantes legales (para empresas)

#### Atributos Faltantes en Entidad Titular
```typescript
// Contacto extendido
telefono?: string;
email?: string;
direccion?: string;
comuna?: string;
region?: string;

// Legal
giroComercial?: string; // Para empresas
representanteLegal?: string;
rutRepresentante?: string;

// Documentación
documentos?: Documento[];

// Auditoría
ultimaModificacion?: Date;
modificadoPor?: string;
```

---

### 4. 🟢 Módulo de Establecimientos

**Estado:** ✅ Completado  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ CRUD completo de establecimientos
- ✅ Asociación con titulares
- ✅ Tipos: Propio, Socio, Externo
- ✅ Gestión de ubicación
- ✅ Rol predial (opcional)
- ✅ Toggle de estado
- ✅ Contador de lotes y animales
- ✅ Búsqueda y filtros

#### Archivos Principales
- `src/app/dashboard/configuracion/establecimientos/page.tsx`
- `src/components/establecimientos/establecimiento-form.tsx`
- `src/lib/api/establecimientos.ts`

#### Funcionalidades Faltantes
- ❌ Geolocalización (coordenadas GPS)
- ❌ Superficie total y útil
- ❌ Capacidad máxima de animales
- ❌ Infraestructura (corrales, mangas, comederos)
- ❌ Mapa de potreros/sectores
- ❌ Historial de stock
- ❌ Alertas de sobrecarga
- ❌ Documentación legal (permisos, certificados)

#### Atributos Faltantes en Entidad Establecimiento
```typescript
// Geolocalización
latitud?: number;
longitud?: number;
coordenadasPoligono?: string; // GeoJSON

// Características físicas
superficieTotal?: number; // hectáreas
superficieUtil?: number;
capacidadMaxima?: number;

// Infraestructura
cantidadCorrales?: number;
cantidadPotreros?: number;
tieneAgua?: boolean;
tieneLuz?: boolean;

// Legal
certificadoSAG?: string;
fechaVencimientoCertificado?: Date;
permisoAmbiental?: string;

// Contacto en terreno
encargado?: string;
telefonoEncargado?: string;
```

---

### 5. 🟢 Módulo de Lotes

**Estado:** ✅ Completado  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ CRUD completo de lotes
- ✅ Asociación con establecimientos
- ✅ Asignación de animales a lotes
- ✅ Remoción de animales de lotes
- ✅ Listado de animales por lote
- ✅ Contador de animales
- ✅ Peso promedio del lote
- ✅ Estados: activo, inactivo
- ✅ Búsqueda y filtros

#### Archivos Principales
- `src/app/dashboard/lotes/page.tsx`
- `src/app/dashboard/lotes/[id]/page.tsx`
- `src/components/lotes/lote-form.tsx`
- `src/lib/api/lotes.ts`

#### Funcionalidades Faltantes
- ❌ Historial de composición del lote
- ❌ Estadísticas avanzadas (GDP promedio, homogeneidad)
- ❌ Proyección de peso futuro
- ❌ Costo de alimentación por lote
- ❌ Alertas de dispersión de pesos
- ❌ Comparación entre lotes
- ❌ Cierre de lotes con reporte final
- ❌ Asignación de dietas/raciones

#### Atributos Faltantes en Entidad Lote
```typescript
// Gestión
fechaApertura?: Date;
fechaCierre?: Date;
motivoCierre?: string;
cerrado?: boolean;

// Productividad
pesoInicialPromedio?: number;
pesoFinalPromedio?: number;
gdpPromedio?: number;
diasEngorda?: number;

// Costos
costoAlimentacion?: number;
costoSanitario?: number;
costoTotal?: number;

// Dieta
dietaAsignada?: string;
consumoDiario?: number; // kg/animal/día

// Ubicación específica
potrero?: string;
corral?: string;
```

---

### 6. 🟢 Módulo de Pesajes

**Estado:** ✅ Completado (Core)  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ Creación de sesiones de pesaje
- ✅ Registro manual de pesajes
- ✅ Importación desde XR5000 (CSV/TXT)
- ✅ Asociación con lotes
- ✅ Validación de datos
- ✅ Historial de pesajes por animal
- ✅ Estadísticas de sesión (promedio, min, max)
- ✅ Eliminación de pesajes individuales
- ✅ Origen de datos (XR5000/Manual)

#### Archivos Principales
- `src/app/dashboard/pesajes/page.tsx`
- `src/components/pesajes/sesion-form.tsx`
- `src/lib/api/pesajes.ts`
- `src/services/xr5000/` (parcial)

#### Funcionalidades Faltantes
- ❌ Importación automática desde XR5000 (sin archivo)
- ❌ Conexión directa con balanza/lector RFID
- ❌ Validación automática de pesos anómalos
- ❌ Cálculo automático de GDP
- ❌ Gráficos de evolución de peso
- ❌ Comparación con pesos anteriores
- ❌ Alertas de pérdida de peso
- ❌ Exportación de datos de pesaje
- ❌ Proyección de peso futuro
- ❌ Análisis de homogeneidad del lote

#### Atributos Faltantes en Entidad Pesaje
```typescript
// Validación
pesoAnterior?: number;
diferenciaPeso?: number;
diasDesdeUltimoPesaje?: number;
gdp?: number;
anomalo?: boolean;
motivoInvalidacion?: string;

// Contexto
temperatura?: number;
condicionClimatica?: string;
horaDelDia?: string;
```

#### Atributos Faltantes en Entidad SesionPesaje
```typescript
// Estadísticas
pesoMinimo?: number;
pesoMaximo?: number;
desviacionEstandar?: number;
coeficienteVariacion?: number;

// Condiciones
temperatura?: number;
condicionesClimaticas?: string;

// Validación
pesajesValidados?: number;
pesajesInvalidados?: number;
```

---

### 7. 🟢 Módulo de Movimientos

**Estado:** ✅ Completado (Core)  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ Creación de movimientos (Traslado, Venta, Compra, Muerte, Ajuste)
- ✅ Estados: Borrador, Confirmado, Informado
- ✅ Confirmación de movimientos
- ✅ Asociación de animales
- ✅ Origen y destino (establecimientos/titulares)
- ✅ Documentos asociados (Guía, Factura, Formulario)
- ✅ Historial de movimientos
- ✅ Estadísticas de movimientos
- ✅ Filtros por tipo, estado, fechas

#### Archivos Principales
- `src/app/dashboard/movimientos/page.tsx`
- `src/components/movimientos/movimiento-form.tsx`
- `src/lib/api/movimientos.ts`

#### Funcionalidades Faltantes
- ❌ Integración con SIPEC para informar movimientos
- ❌ Generación automática de guías de despacho
- ❌ Validación de documentos tributarios
- ❌ Notificaciones de movimientos pendientes
- ❌ Reversión de movimientos
- ❌ Movimientos masivos (múltiples animales)
- ❌ Cálculo automático de costos de transporte
- ❌ Seguimiento GPS de traslados
- ❌ Firma digital de documentos
- ❌ Alertas de vencimiento de guías

#### Atributos Faltantes en Entidad Movimiento
```typescript
// Logística
transportista?: string;
rutTransportista?: string;
patente?: string;
chofer?: string;
rutChofer?: string;

// Costos
costoTransporte?: number;
costoDocumentacion?: number;
costoTotal?: number;

// Seguimiento
horaInicio?: Date;
horaLlegada?: Date;
distanciaKm?: number;

// SIPEC
numeroSIPEC?: string;
fechaInformadoSIPEC?: Date;
estadoSIPEC?: string;

// Validación
validadoPor?: string;
fechaValidacion?: Date;
observacionesValidacion?: string;
```

#### Atributos Faltantes en Entidad Documento
```typescript
// Validación tributaria
timbreSII?: string;
estadoSII?: string;
fechaEmision?: Date;

// Almacenamiento
archivoNombre?: string;
archivoTamano?: number;
archivoMimeType?: string;

// Firma digital
firmadoDigitalmente?: boolean;
firmante?: string;
fechaFirma?: Date;
```

---

### 8. 🟢 Módulo de Dashboard

**Estado:** ✅ Completado (Core)  
**Prioridad:** Alta

#### Funcionalidades Implementadas
- ✅ Estadísticas generales (animales, lotes, pesajes, movimientos)
- ✅ Movimientos recientes
- ✅ Stock por establecimiento
- ✅ Auto-refresh cada 30 segundos
- ✅ Indicadores de cambio (trending)
- ✅ Refresh manual
- ✅ Manejo de errores

#### Archivos Principales
- `src/app/dashboard/page.tsx`
- `src/lib/api/dashboard.ts`
- `src/components/dashboard/`

#### Funcionalidades Faltantes
- ❌ Gráficos interactivos (Chart.js/Recharts)
- ❌ Comparación de períodos
- ❌ Filtros por fecha
- ❌ Exportación de reportes
- ❌ Dashboard personalizable (widgets)
- ❌ Alertas y notificaciones
- ❌ KPIs financieros
- ❌ Proyecciones y tendencias
- ❌ Dashboard por establecimiento

---

### 9. 🟡 Módulo de Reportes

**Estado:** 🚧 Parcial (30%)  
**Prioridad:** Media

#### Funcionalidades Implementadas
- ✅ Estructura de rutas
- ✅ Navegación básica

#### Funcionalidades Faltantes
- ❌ Reporte de stock actual
- ❌ Reporte de movimientos por período
- ❌ Reporte de pesajes y GDP
- ❌ Reporte de trazabilidad
- ❌ Reporte sanitario
- ❌ Reporte financiero
- ❌ Exportación a Excel/PDF
- ❌ Programación de reportes automáticos
- ❌ Envío por email

#### Reportes a Implementar
1. **Stock Actual**
   - Por establecimiento
   - Por lote
   - Por categoría
   - Por estado

2. **Movimientos**
   - Traslados por período
   - Ventas y compras
   - Bajas y muertes
   - Análisis de flujo

3. **Productividad**
   - Evolución de pesos
   - GDP por lote
   - Comparación entre períodos
   - Eficiencia de engorda

4. **Trazabilidad**
   - Historial completo por animal
   - Cumplimiento SIPEC
   - Certificaciones

5. **Financiero**
   - Costos por animal
   - Costos por lote
   - Rentabilidad
   - Proyecciones

---

### 10. 🟡 Módulo de Razas

**Estado:** 🚧 Backend implementado, Frontend pendiente  
**Prioridad:** Media

#### Funcionalidades Implementadas (Backend)
- ✅ CRUD de razas
- ✅ Asociación con especies
- ✅ Estados activo/inactivo

#### Funcionalidades Faltantes
- ❌ Interfaz de gestión de razas
- ❌ Catálogo de razas predefinidas
- ❌ Características por raza
- ❌ Parámetros productivos por raza
- ❌ Imágenes de referencia

#### Archivos Principales
- `src/lib/api/razas.ts` (implementado)
- Frontend: Pendiente

---

## Módulos en Desarrollo

### 1. 🟡 Modo Offline (PWA)

**Estado:** 🚧 En desarrollo (40%)  
**Prioridad:** Alta

#### Objetivo
Permitir el uso de la aplicación sin conexión a internet, especialmente útil para trabajo en terreno.

#### Funcionalidades Planificadas
- 🚧 Service Worker configurado
- 🚧 Cache de datos críticos
- 🚧 Sincronización en background
- ❌ Manejo de conflictos
- ❌ Indicador de estado de conexión
- ❌ Cola de operaciones pendientes

#### Archivos
- `src/services/offline/`
- `public/sw.js` (pendiente)

#### Desafíos Técnicos
- Sincronización de datos conflictivos
- Tamaño del cache
- Estrategia de actualización
- Manejo de imágenes y archivos grandes

---

### 2. 🟡 Sincronización Automática

**Estado:** 🚧 En desarrollo (30%)  
**Prioridad:** Alta

#### Objetivo
Sincronizar automáticamente los datos locales con el backend cuando hay conexión.

#### Funcionalidades Planificadas
- 🚧 Detección de cambios locales
- 🚧 Cola de sincronización
- ❌ Resolución de conflictos
- ❌ Sincronización incremental
- ❌ Logs de sincronización

#### Archivos
- `src/services/sync/`

---

### 3. 🟡 Integración XR5000

**Estado:** 🚧 Parcial (50%)  
**Prioridad:** Media

#### Objetivo
Importar datos de pesaje desde equipos XR5000 de forma automática.

#### Funcionalidades Implementadas
- ✅ Parseo de archivos CSV/TXT
- ✅ Importación manual

#### Funcionalidades Faltantes
- ❌ Conexión directa con equipo
- ❌ Importación automática
- ❌ Configuración de formatos
- ❌ Validación avanzada

#### Archivos
- `src/services/xr5000/`

---

## Módulos Planificados

### 1. ❌ Módulo Sanitario

**Estado:** ⚪ No iniciado  
**Prioridad:** Alta

#### Funcionalidades Planificadas
- Registro de vacunaciones
- Control de tratamientos médicos
- Calendario sanitario
- Alertas de vencimiento
- Historial clínico por animal
- Gestión de veterinarios
- Inventario de medicamentos
- Cumplimiento de períodos de resguardo

#### Entidades Necesarias
```typescript
interface Vacunacion {
  id: string;
  animalId: string;
  vacuna: string;
  fecha: Date;
  dosis: string;
  lote: string;
  veterinario?: string;
  proximaDosis?: Date;
}

interface Tratamiento {
  id: string;
  animalId: string;
  medicamento: string;
  diagnostico: string;
  fechaInicio: Date;
  fechaFin?: Date;
  dosis: string;
  frecuencia: string;
  veterinario: string;
  periodoResguardo: number; // días
  observaciones?: string;
}

interface CalendarioSanitario {
  id: string;
  establecimientoId?: string;
  loteId?: string;
  actividad: string;
  fechaProgramada: Date;
  fechaRealizada?: Date;
  estado: 'PENDIENTE' | 'REALIZADA' | 'VENCIDA';
}
```

---

### 2. ❌ Módulo de Reproducción

**Estado:** ⚪ No iniciado  
**Prioridad:** Media

#### Funcionalidades Planificadas
- Registro de servicios/inseminaciones
- Control de gestación
- Registro de partos
- Genealogía completa
- Estadísticas reproductivas
- Alertas de celo
- Planificación de servicios

#### Entidades Necesarias
```typescript
interface Servicio {
  id: string;
  hembraId: string;
  machoId?: string;
  tipo: 'MONTA_NATURAL' | 'INSEMINACION_ARTIFICIAL';
  fecha: Date;
  tecnico?: string;
  pajuela?: string;
  exitoso?: boolean;
}

interface Gestacion {
  id: string;
  hembraId: string;
  servicioId: string;
  fechaConfirmacion: Date;
  fechaEstimadaParto: Date;
  estado: 'CONFIRMADA' | 'ABORTADA' | 'FINALIZADA';
}

interface Parto {
  id: string;
  hembraId: string;
  gestacionId: string;
  fecha: Date;
  tipo: 'NORMAL' | 'ASISTIDO' | 'CESAREA';
  criasVivas: number;
  criasMuertas: number;
  complicaciones?: string;
  crias: string[]; // IDs de animales
}
```

---

### 3. ❌ Módulo Financiero

**Estado:** ⚪ No iniciado  
**Prioridad:** Media

#### Funcionalidades Planificadas
- Registro de costos por animal/lote
- Control de gastos operacionales
- Registro de ventas
- Cálculo de rentabilidad
- Proyecciones financieras
- Reportes contables
- Integración con sistemas contables

#### Entidades Necesarias
```typescript
interface Costo {
  id: string;
  tipo: 'ALIMENTACION' | 'SANITARIO' | 'MANO_OBRA' | 'TRANSPORTE' | 'OTRO';
  concepto: string;
  monto: number;
  fecha: Date;
  animalId?: string;
  loteId?: string;
  establecimientoId?: string;
  documento?: string;
}

interface Venta {
  id: string;
  movimientoId: string;
  comprador: string;
  rutComprador: string;
  precioUnitario: number;
  precioTotal: number;
  formaPago: string;
  factura?: string;
  pagado: boolean;
}
```

---

### 4. ❌ Integración SIPEC/SAG

**Estado:** ⚪ No iniciado  
**Prioridad:** Alta

#### Sobre SIPEC (Sistema de Información Pecuaria)

El **Programa Oficial de Trazabilidad Animal** del SAG es un sistema de gestión pública-privada que constituye una herramienta fundamental para garantizar la seguridad sanitaria de los productos pecuarios nacionales. Opera desde el 01 de enero de 2005 y mantiene la trazabilidad de animales vivos, ya sea en forma individual para bovinos o por lotes para otras especies.

**Objetivo:** Mantener identificados los animales o sus productos a lo largo de las cadenas de producción, comercialización y transformación hasta su origen, con el fin de realizar investigaciones epidemiológicas o establecer acciones correctivas.

**Especies cubiertas:**
- **Individual:** Bovinos (con DIIO)
- **Por lotes:** Equinos, ovinos, caprinos, aves, cerdos, camélidos sudamericanos domésticos, abejas, conejos, ratites y jabalíes

#### Componentes Estructurales de SIPEC

##### 1. Registro de Establecimientos Pecuarios (RUP)
Contiene información que permite identificar a los establecimientos pecuarios donde existen permanente o temporalmente animales. Cada establecimiento se identifica con un **Rol Único Pecuario (RUP)**.

##### 2. Declaración de Existencia de Animales (DEA)
Corresponde a la información anual de existencias de todos los animales por especie y clase, de cada establecimiento con RUP.

##### 3. Identificación Animal Oficial (DIIO)
Proceso que permite identificar oficialmente a un animal mediante el **Dispositivo de Identificación Individual Oficial (DIIO)** y vincularlo al establecimiento donde se realizó esta actividad.

##### 4. Registro de Movimiento Animal
Registro de todos los movimientos de los animales identificados individualmente (con DIIO) o por lotes, que se realizan entre establecimientos con RUP.

##### 5. Sistema Oficial de Información Pecuaria (SIPECweb)
Sistema de información nacional del SAG donde se ingresan, alojan y administran todos los registros del Programa. La información se obtiene mediante formularios en papel o funcionalidades electrónicas.

#### Módulos del Sistema SIPEC

##### Módulo 1: REGISTRO COMPRA DIIO
**Funcionalidad:** Registro y gestión de la compra de Dispositivos de Identificación Individual Oficial (DIIO)

**Características:**
- Registro de solicitud de DIIO
- Seguimiento de pedidos
- Control de stock de DIIO
- Asignación de rangos de DIIO a titulares
- Validación de DIIO oficiales

**Datos gestionados:**
- Número de DIIO
- Rango de números asignados
- Fecha de compra
- Titular solicitante
- Estado del DIIO (disponible, asignado, dado de baja)

##### Módulo 2: IDENTIFICACIÓN ANIMAL CON DIIO
**Funcionalidad:** Registro de la identificación oficial de animales bovinos con DIIO

**Características:**
- Asignación de DIIO a animal específico
- Registro de fecha de identificación
- Vinculación con establecimiento (RUP)
- Registro de características del animal
- Validación de DIIO único por animal
- Reemplazo de DIIO (por pérdida o daño)

**Datos gestionados:**
- Número de DIIO
- Fecha de identificación
- RUP del establecimiento
- Especie y raza
- Sexo del animal
- Fecha de nacimiento (estimada o real)
- Motivo de reemplazo (si aplica)

**Formulario asociado:** FIIO (Formulario de Identificación Individual Oficial)

##### Módulo 3: ESTABLECIMIENTOS
**Funcionalidad:** Registro y gestión de establecimientos pecuarios con RUP

**Características:**
- Solicitud de RUP (Rol Único Pecuario)
- Actualización de datos del establecimiento
- Registro de titular responsable
- Ubicación geográfica
- Tipo de establecimiento
- Especies presentes
- Capacidad del establecimiento

**Datos gestionados:**
- RUP (Rol Único Pecuario)
- Nombre del establecimiento
- RUT del titular
- Dirección y ubicación
- Comuna y región
- Coordenadas geográficas
- Tipo de explotación
- Especies y cantidad de animales
- Estado del RUP (activo, suspendido)

##### Módulo 4: EXISTENCIAS ANIMALES
**Funcionalidad:** Declaración anual de existencias de animales por establecimiento (DEA)

**Características:**
- Declaración anual obligatoria
- Registro por especie y categoría
- Actualización de inventario
- Validación de consistencia con movimientos
- Generación de reportes de existencias
- Histórico de declaraciones

**Datos gestionados:**
- RUP del establecimiento
- Año de la declaración
- Especie animal
- Categoría (terneros, vacas, toros, etc.)
- Cantidad de animales
- Fecha de declaración
- Estado de la declaración

**Formulario asociado:** DEA (Declaración de Existencia de Animales)

##### Módulo 5: MOVIMIENTOS ANIMALES
**Funcionalidad:** Registro de todos los movimientos de animales entre establecimientos

**Características:**
- Registro de traslados entre RUP
- Movimientos de venta
- Movimientos de compra
- Ingreso a matadero/faena
- Muerte de animales
- Exportación
- Importación
- Validación de DIIO en movimientos
- Generación de guías de movimiento
- Seguimiento de trazabilidad

**Datos gestionados:**
- Tipo de movimiento
- RUP origen
- RUP destino
- Fecha del movimiento
- Cantidad de animales (lotes)
- DIIO individuales (bovinos)
- Documento de respaldo (guía, factura)
- Transportista
- Patente del vehículo
- Estado del movimiento (informado, validado)

**Tipos de movimiento:**
- Traslado entre predios
- Venta
- Compra
- Faena
- Muerte
- Exportación
- Importación

##### Módulo 6: REGISTRO DE APLICACIONES
**Funcionalidad:** Registro de aplicaciones sanitarias y tratamientos veterinarios

**Características:**
- Registro de vacunaciones
- Registro de tratamientos médicos
- Control de medicamentos aplicados
- Períodos de resguardo
- Trazabilidad sanitaria
- Cumplimiento de programas oficiales
- Registro de veterinario responsable

**Datos gestionados:**
- RUP del establecimiento
- DIIO del animal (si aplica)
- Tipo de aplicación (vacuna, tratamiento)
- Producto aplicado
- Dosis
- Fecha de aplicación
- Veterinario responsable
- Período de resguardo
- Lote del producto
- Fecha de vencimiento del producto
- Motivo de la aplicación

**Programas sanitarios cubiertos:**
- Vacunación antiaftosa
- Brucelosis
- Tuberculosis
- Otros programas oficiales SAG

#### Funcionalidades de Integración Planificadas

##### Fase 1: Consulta y Validación
- ✅ Validación de RUP de establecimientos
- ✅ Consulta de animales registrados en SIPEC
- ✅ Validación de DIIO oficiales
- ✅ Verificación de estado de trazabilidad

##### Fase 2: Sincronización de Datos
- 📋 Sincronización de establecimientos (RUP)
- 📋 Importación de animales desde SIPEC
- 📋 Actualización de datos de trazabilidad
- 📋 Sincronización bidireccional

##### Fase 3: Informar Movimientos
- 📋 Informar traslados automáticamente
- 📋 Informar ventas y compras
- 📋 Informar faenas
- 📋 Informar muertes
- 📋 Generación automática de documentos

##### Fase 4: Declaraciones Oficiales
- 📋 Generación de DEA (Declaración de Existencias)
- 📋 Envío automático de DEA a SIPEC
- 📋 Registro de aplicaciones sanitarias
- 📋 Cumplimiento de programas oficiales

##### Fase 5: Certificación
- 📋 Solicitud de certificados de trazabilidad
- 📋 Certificados de exportación
- 📋 Certificados sanitarios
- 📋 Validación de cumplimiento normativo

#### Mapeo de Funcionalidades: Mi Ganado ↔ SIPEC

| Funcionalidad Mi Ganado | Módulo SIPEC | Estado Integración |
|-------------------------|--------------|-------------------|
| Gestión de Establecimientos | Módulo 3: ESTABLECIMIENTOS | ⚪ Pendiente |
| Registro de Animales | Módulo 2: IDENTIFICACIÓN ANIMAL | ⚪ Pendiente |
| Identificadores (DIIO) | Módulo 1 y 2: COMPRA/IDENTIFICACIÓN | ⚪ Pendiente |
| Movimientos de Ganado | Módulo 5: MOVIMIENTOS ANIMALES | ⚪ Pendiente |
| Inventario/Stock | Módulo 4: EXISTENCIAS ANIMALES | ⚪ Pendiente |
| Manejo Sanitario | Módulo 6: REGISTRO DE APLICACIONES | ❌ No implementado |

#### Requisitos Técnicos para Integración

**Autenticación:**
- Credenciales de acceso a SIPECweb
- Certificado digital (posiblemente)
- RUT del titular autorizado

**Conectividad:**
- API REST o SOAP (a confirmar con SAG)
- Webservices disponibles
- Formato de datos: XML o JSON

**Validaciones:**
- RUP válido y activo
- DIIO oficiales y únicos
- Consistencia de movimientos
- Períodos de declaración

**Documentación requerida:**
- Manual de integración técnica
- Especificación de webservices
- Catálogos de códigos
- Reglas de negocio

#### Desafíos de Integración

1. **Disponibilidad de API**
   - SIPEC no tiene API pública documentada
   - Requiere coordinación directa con SAG
   - Posible acceso solo para sistemas certificados

2. **Autenticación y Seguridad**
   - Manejo de credenciales por titular
   - Certificados digitales
   - Permisos y autorizaciones

3. **Sincronización de Datos**
   - Manejo de conflictos
   - Datos históricos
   - Frecuencia de sincronización

4. **Validaciones de Negocio**
   - Reglas complejas de trazabilidad
   - Períodos de declaración
   - Validaciones cruzadas

5. **Cumplimiento Normativo**
   - Cambios en normativa
   - Actualizaciones del sistema
   - Auditoría y trazabilidad

#### Beneficios de la Integración

**Para el Usuario:**
- ✅ Cumplimiento automático de obligaciones legales
- ✅ Reducción de trabajo manual y duplicación de datos
- ✅ Validación en tiempo real
- ✅ Trazabilidad completa garantizada
- ✅ Certificados automáticos

**Para el Sistema:**
- ✅ Datos oficiales y validados
- ✅ Sincronización con autoridad sanitaria
- ✅ Mayor confiabilidad
- ✅ Valor agregado significativo

#### Próximos Pasos

1. **Investigación:** Contactar a SAG para información sobre API/webservices
2. **Análisis:** Evaluar viabilidad técnica y costos
3. **Prototipo:** Desarrollar integración básica (consulta RUP)
4. **Piloto:** Probar con usuarios reales
5. **Producción:** Despliegue completo de integración

#### Referencias

- **Sitio oficial:** https://www.sag.gob.cl/ambitos-de-accion/programa-oficial-de-trazabilidad-animal
- **Acceso SIPECweb:** https://www.sag.gob.cl/ambitos-de-accion/acceso-directo-sipecweb
- **Formularios:** https://www.sag.gob.cl/ambitos-de-accion/acceso-formularios-del-programa-para-descargar-e-imprimir-dea-fiio-etc
- **Normativa:** https://www.sag.gob.cl/ambitos-de-accion/programa-oficial-de-trazabilidad-animal/normativas

---

### 5. ❌ Módulo de Notificaciones

**Estado:** ⚪ No iniciado  
**Prioridad:** Baja

#### Funcionalidades Planificadas
- Notificaciones push
- Alertas por email
- Alertas en la aplicación
- Configuración de preferencias
- Notificaciones programadas

#### Tipos de Alertas
- Vacunas próximas a vencer
- Tratamientos pendientes
- Movimientos sin confirmar
- Animales sin pesar en X días
- Pérdida de peso anormal
- Documentos por vencer

---

### 6. ❌ Módulo de Usuarios y Permisos

**Estado:** ⚪ No iniciado (Backend parcial)  
**Prioridad:** Media

#### Funcionalidades Planificadas
- Gestión de usuarios
- Roles y permisos (RBAC)
- Auditoría de acciones
- Permisos por establecimiento
- Permisos por módulo

#### Roles Propuestos
- **SUPER_ADMIN:** Acceso total
- **ADMIN:** Gestión completa de su organización
- **GERENTE:** Visualización y reportes
- **OPERADOR:** Registro de datos (pesajes, movimientos)
- **VETERINARIO:** Módulo sanitario
- **CONTADOR:** Módulo financiero

---

## Entidades del Sistema

### Entidades Principales Implementadas

#### 1. Animal
```typescript
interface Animal {
  id: string;
  especie: Especie;
  razaId?: string;
  sexo?: Sexo;
  categoria?: CategoriaAnimal;
  fechaNacimiento?: string;
  titularActualId?: string;
  establecimientoActualId?: string;
  loteId?: string;
  estado: EstadoAnimal;
  fechaAlta: string;
  fechaBaja?: string;
  
  // Trazabilidad SIPEC
  rupOrigen?: string;
  rupUltimoMovimiento?: string;
  exportableChina?: boolean;
  exportableUE?: boolean;
  pabco?: boolean;
  trazabilidadNacimiento?: boolean;
  trazabilidadCompleta?: boolean;
  usoAnabolicos?: boolean;
  usoMedicamentoNoPermitido?: boolean;
  
  // Relaciones
  raza?: Raza;
  titularActual?: Titular;
  establecimientoActual?: Establecimiento;
  lote?: Lote;
  identificadores?: Identificador[];
  manejosSanitarios?: ManejoSanitario[];
}
```

#### 2. Titular
```typescript
interface Titular {
  id: string;
  rut: string;
  nombreRazonSocial: string;
  tipo: TipoTitular; // PERSONA_NATURAL | EMPRESA
  contacto?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
}
```

#### 3. Establecimiento
```typescript
interface Establecimiento {
  id: string;
  titularId: string;
  nombre: string;
  rolPredial?: string;
  ubicacion?: string;
  tipo: TipoEstablecimiento; // PROPIO | SOCIO | EXTERNO
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
  titular?: Titular;
}
```

#### 4. Identificador
```typescript
interface Identificador {
  id: string;
  animalId: string;
  tipo: TipoIdentificador; // DIIO_VISUAL | RFID | CHIP | BOLUS
  codigo: string;
  activo: boolean;
  fechaAsignacion: string;
  fechaBaja?: string;
  motivoBaja?: string;
  fechaSipec?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 5. Lote
```typescript
interface Lote {
  id: string;
  establecimientoId: string;
  nombre: string;
  descripcion?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
  establecimiento?: Establecimiento;
}
```

#### 6. Movimiento
```typescript
interface Movimiento {
  id: string;
  tipo: TipoMovimiento; // TRASLADO | VENTA | COMPRA | MUERTE | AJUSTE
  fecha: string;
  establecimientoOrigenId?: string;
  establecimientoDestinoId?: string;
  titularOrigenId?: string;
  titularDestinoId?: string;
  estado: EstadoMovimiento; // BORRADOR | CONFIRMADO | INFORMADO
  createdAt: string;
  updatedAt: string;
  detalles?: MovimientoDetalle[];
  documentos?: Documento[];
}
```

#### 7. SesionPesaje
```typescript
interface SesionPesaje {
  id: string;
  loteId?: string;
  fecha: string;
  equipo?: string;
  operador?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  pesajes?: Pesaje[];
}
```

#### 8. Pesaje
```typescript
interface Pesaje {
  id: string;
  sesionId: string;
  animalId: string;
  peso: number;
  fechaHora: string;
  origenDato: OrigenDato; // XR5000 | MANUAL
  valido: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Integraciones Actuales

### 1. ✅ Backend API (NestJS)
- **Estado:** Implementado
- **Protocolo:** REST API
- **Autenticación:** JWT + API Key
- **Endpoints:** 50+ endpoints implementados

### 2. 🚧 XR5000 (Importación de archivos)
- **Estado:** Parcial
- **Método:** Importación manual de CSV/TXT
- **Pendiente:** Conexión directa

---

## Integraciones Pendientes

### 1. ❌ SIPEC/SAG (Servicio Agrícola y Ganadero)
**Prioridad:** Alta  
**Complejidad:** Alta

#### Funcionalidades
- Consulta de animales
- Informar movimientos
- Validación de RUP
- Obtener certificados

#### Desafíos
- Disponibilidad de API pública
- Documentación técnica
- Proceso de autorización

---

### 2. ❌ XR5000 (Conexión directa)
**Prioridad:** Media  
**Complejidad:** Media

#### Funcionalidades
- Lectura automática de datos
- Sincronización en tiempo real
- Configuración de equipos

---

### 3. ❌ Sistemas Contables
**Prioridad:** Baja  
**Complejidad:** Media

#### Opciones
- Integración con Defontana
- Integración con Softland
- Integración con Buk
- API genérica para otros sistemas

---

### 4. ❌ Servicios de Geolocalización
**Prioridad:** Baja  
**Complejidad:** Baja

#### Funcionalidades
- Mapas de establecimientos
- Tracking de traslados
- Zonas de pastoreo

---

### 5. ❌ Servicios de Notificaciones
**Prioridad:** Baja  
**Complejidad:** Baja

#### Opciones
- Firebase Cloud Messaging
- SendGrid (email)
- Twilio (SMS)

---

## Roadmap de Desarrollo

### Fase 1: Consolidación (Q1 2026) ✅ En curso
- [x] Completar módulos core
- [x] Estabilizar API
- [ ] Mejorar UX/UI
- [ ] Testing completo
- [ ] Documentación técnica

### Fase 2: Productividad (Q2 2026)
- [ ] Módulo sanitario completo
- [ ] Reportes avanzados
- [ ] Exportación de datos
- [ ] Gráficos y visualizaciones
- [ ] Modo offline completo

### Fase 3: Integración (Q3 2026)
- [ ] Integración SIPEC
- [ ] Conexión directa XR5000
- [ ] Módulo financiero
- [ ] Sistema de notificaciones

### Fase 4: Escalabilidad (Q4 2026)
- [ ] Multi-especie (ovinos, caprinos)
- [ ] Módulo de reproducción
- [ ] App móvil nativa
- [ ] Integraciones contables
- [ ] Multi-tenant (SaaS)

---

## Prioridades de Desarrollo

### 🔴 Crítico (Próximos 30 días)
1. Completar modo offline
2. Mejorar importación XR5000
3. Implementar módulo de reportes básicos
4. Testing y corrección de bugs

### 🟡 Alto (Próximos 90 días)
1. Módulo sanitario completo
2. Gráficos de evolución de peso
3. Exportación de datos (Excel/PDF)
4. Módulo de usuarios y permisos
5. Integración SIPEC (investigación)

### 🟢 Medio (Próximos 180 días)
1. Módulo financiero
2. Módulo de reproducción
3. Notificaciones push
4. App móvil

### ⚪ Bajo (Futuro)
1. Multi-especie
2. Integraciones contables
3. Geolocalización avanzada
4. IA para predicciones

---

## Métricas de Progreso

### Módulos
- **Completados:** 7/15 (47%)
- **En desarrollo:** 3/15 (20%)
- **Planificados:** 5/15 (33%)

### Funcionalidades Core
- **Implementadas:** 85%
- **En desarrollo:** 10%
- **Pendientes:** 5%

### Integraciones
- **Implementadas:** 1/5 (20%)
- **En desarrollo:** 1/5 (20%)
- **Pendientes:** 3/5 (60%)

---

## Notas Técnicas

### Deuda Técnica Identificada
1. **Cache:** Implementar estrategia más robusta
2. **Validaciones:** Centralizar validaciones de negocio
3. **Tests:** Aumentar cobertura de tests (actualmente <20%)
4. **Documentación:** Completar JSDoc en componentes
5. **Performance:** Optimizar queries pesadas
6. **Seguridad:** Implementar rate limiting

### Mejoras de Arquitectura
1. Implementar Event Sourcing para auditoría
2. Migrar a GraphQL para queries complejas
3. Implementar WebSockets para actualizaciones en tiempo real
4. Separar backend en microservicios

---

## Conclusiones

El sistema **Mi Ganado** cuenta con una base sólida con los módulos core implementados (70% completado). Las prioridades inmediatas son:

1. **Estabilizar** los módulos existentes
2. **Completar** el modo offline para trabajo en terreno
3. **Implementar** el módulo sanitario (alta demanda)
4. **Integrar** con SIPEC para cumplimiento normativo
5. **Mejorar** reportes y visualizaciones

El roadmap está diseñado para agregar valor incremental cada trimestre, priorizando funcionalidades que generen mayor impacto para los usuarios finales.

---

**Documento vivo - Se actualiza con cada sprint**  
**Última actualización:** 5 de Febrero 2026  
**Próxima revisión:** 5 de Marzo 2026
