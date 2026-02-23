# Manual de Usuario — Mi Ganado

**Versión:** 1.0  
**Fecha:** 2026-02-11  
**Plataforma:** miganado.cl · www.miganado.cl · miganado.vercel.app

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Primeros Pasos](#2-primeros-pasos)
3. [Navegación General](#3-navegación-general)
4. [Configuración Inicial](#4-configuración-inicial)
5. [Dashboard (Inicio)](#5-dashboard-inicio)
6. [Ganado (Animales)](#6-ganado-animales)
7. [Lotes](#7-lotes)
8. [Pesajes](#8-pesajes)
9. [Movimientos](#9-movimientos)
10. [Reportes](#10-reportes)
11. [Sanitario](#11-sanitario)
12. [Financiero](#12-financiero)
13. [Notificaciones y Alertas](#13-notificaciones-y-alertas)
14. [Funciones Transversales](#14-funciones-transversales)
15. [Glosario](#15-glosario)
16. [Soporte y Contacto](#16-soporte-y-contacto)

---

## 1. Introducción

### ¿Qué es Mi Ganado?

Mi Ganado es una plataforma web para la gestión integral de ganado bovino en Chile. Permite llevar el control de animales, pesajes, movimientos, sanidad y finanzas de tu operación ganadera desde cualquier dispositivo con navegador web.

### ¿Para quién está diseñado?

- Productores ganaderos que manejan uno o más establecimientos
- Administradores de predios que necesitan control de inventario animal
- Operadores de terreno que registran pesajes y movimientos
- Veterinarios que llevan el historial sanitario del plantel

### Requisitos

| Requisito | Detalle |
|-----------|---------|
| **Navegador** | Chrome, Safari, Edge o Firefox (versión reciente) |
| **Dispositivo** | Computador, tablet o celular |
| **Conexión** | Internet para sincronizar datos (funciona offline en terreno) |
| **Cuenta** | Usuario y contraseña proporcionados por el administrador |

### Acceso

Ingresa a **www.miganado.cl** desde tu navegador. También puedes instalar la aplicación en tu celular o tablet para acceso directo (ver sección [Instalar como App](#instalar-como-app-pwa)).

---

## 2. Primeros Pasos

### Registro de cuenta

1. Ingresa a **www.miganado.cl/registro**
2. Completa tu nombre, correo electrónico y contraseña
3. La contraseña debe tener al menos 6 caracteres
4. Confirma tu contraseña escribiéndola nuevamente
5. Haz clic en **Crear Cuenta**
6. Serás redirigido a la pantalla de inicio de sesión

### Inicio de sesión

1. Ingresa a **www.miganado.cl/login**
2. Escribe tu correo electrónico y contraseña
3. Haz clic en **Iniciar Sesión**
4. Serás llevado al Dashboard principal

### Recuperación de contraseña

1. En la pantalla de login, haz clic en **¿Olvidaste tu contraseña?**
2. Ingresa tu correo electrónico registrado
3. Recibirás un enlace para restablecer tu contraseña
4. Sigue las instrucciones del correo para crear una nueva contraseña

### Cambiar contraseña

1. Ve a **Configuración → Contraseña** en el menú lateral
2. Ingresa tu contraseña actual
3. Escribe la nueva contraseña y confírmala
4. Haz clic en **Cambiar Contraseña**

### Instalar como App (PWA)

Mi Ganado se puede instalar como aplicación en tu dispositivo para acceso rápido sin abrir el navegador:

**En celular (Android/Chrome):**
1. Abre www.miganado.cl en Chrome
2. Aparecerá un banner en la parte inferior: "Instalar Mi Ganado"
3. Toca **Instalar**
4. La app aparecerá en tu pantalla de inicio

**En celular (iPhone/Safari):**
1. Abre www.miganado.cl en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona **Agregar a pantalla de inicio**
4. Confirma con **Agregar**

**En computador (Chrome):**
1. Abre www.miganado.cl
2. Haz clic en el ícono de instalación en la barra de direcciones
3. Confirma la instalación

---

## 3. Navegación General

### Menú lateral (Sidebar)

El menú lateral izquierdo es tu guía principal de navegación. Está dividido en dos secciones:

**Módulos principales:**

| Ícono | Nombre | Función |
|-------|--------|---------|
| 🏠 | Inicio | Dashboard con resumen general |
| 🐄 | Ganado | Registro y gestión de animales |
| 📦 | Lotes | Agrupación de animales |
| ⚖️ | Pesajes | Control de peso |
| ↔️ | Movimientos | Traslados, ventas, compras |
| 📊 | Reportes | Informes y estadísticas |
| 💉 | Sanitario | Vacunas y tratamientos |
| 💰 | Financiero | Costos y ventas |

**Configuración:**

| Ícono | Nombre | Función |
|-------|--------|---------|
| 🏢 | Establecimientos | Predios ganaderos |
| 👤 | Titulares | Propietarios del ganado |
| 🧬 | Razas | Catálogo de razas |
| 🔒 | Contraseña | Cambiar clave de acceso |
| 🔔 | Alertas | Configurar notificaciones |
| ⚙️ | Configuración | Panel general de ajustes |

### Barra superior (Header)

En la parte superior de la pantalla encontrarás:

- **Centro de notificaciones** (campana) — muestra alertas pendientes con un badge rojo
- **Nombre de usuario** — tu sesión activa
- **Botón de cerrar sesión** — para salir de forma segura

### Navegación en celular

En pantallas pequeñas (celular/tablet), el menú lateral se convierte en un menú deslizable:

1. Toca el ícono de menú (☰) en la esquina superior izquierda
2. Se abrirá el menú lateral como panel deslizante
3. Selecciona la opción deseada
4. El menú se cierra automáticamente

### Filtros y búsqueda

La mayoría de los módulos incluyen:

- **Barra de búsqueda** — para encontrar registros por nombre, DIIO, RUT, etc.
- **Filtros** — selectores para filtrar por estado, tipo, fecha, etc.
- **Paginación** — navegación entre páginas cuando hay muchos registros

---

## 4. Configuración Inicial

Antes de comenzar a registrar animales, debes configurar los datos maestros de tu operación. Sigue este orden:

### Paso 1: Crear un Titular

El titular es el propietario legal del ganado.

1. Ve a **Configuración → Titulares**
2. Haz clic en **Nuevo Titular**
3. Completa los datos:
   - **Nombre o Razón Social** — nombre completo o de la empresa
   - **RUT** — RUT del propietario (formato: 12.345.678-9)
   - **Tipo** — Persona Natural o Empresa
   - **Contacto** — teléfono o email (opcional)
4. Haz clic en **Guardar**

### Paso 2: Crear Establecimientos

Los establecimientos son los predios o campos donde se encuentra el ganado.

1. Ve a **Configuración → Establecimientos**
2. Haz clic en **Nuevo Establecimiento**
3. Completa los datos:
   - **Nombre** — nombre del predio (ej: "Santa María", "El Roble")
   - **Titular** — selecciona el propietario creado en el paso anterior
   - **RUP** — Rol Único Pecuario asignado por el SAG (ej: 11.1.01.1241)
   - **Tipo** — Propio, Socio o Externo
   - **Ubicación** — dirección o referencia geográfica (opcional)
4. Haz clic en **Guardar**
5. Repite para cada predio de tu operación

### Paso 3: Cargar Razas

Las razas se usan al registrar animales.

1. Ve a **Configuración → Razas**
2. Haz clic en **Nueva Raza**
3. Ingresa el nombre de la raza (ej: "Angus Negro", "Hereford")
4. Selecciona la especie (Bovino, Ovino, etc.)
5. Haz clic en **Guardar**

> **Consejo:** Las razas más comunes en Chile son Angus Negro, Angus Rojo, Hereford, Limousin, Overo Colorado, Charolais y Simmental.

### Paso 4: Configurar Alertas

1. Ve a **Configuración → Alertas**
2. Activa o desactiva las categorías de alertas que deseas recibir:
   - **Sanitario** — eventos vencidos o próximos a vencer
   - **Ventas** — ventas pendientes de cobro
   - **Movimientos** — movimientos en estado borrador
3. Los cambios se guardan automáticamente

---

## 5. Dashboard (Inicio)

### ¿Qué es?

El Dashboard es tu pantalla principal. Muestra un resumen en tiempo real de toda tu operación: cantidad de ganado, lotes activos, pesajes recientes y movimientos del mes.

### ¿Cómo se usa?

1. Al ingresar a la aplicación, el Dashboard se carga automáticamente
2. Las **tarjetas superiores** muestran los indicadores clave con su variación mensual
3. La **tabla de "Últimos Movimientos"** muestra los traslados, ventas y compras recientes
4. El **gráfico circular** muestra la distribución de animales por estado (activo, vendido, muerto)
5. El **gráfico de barras** muestra el stock por establecimiento

### Indicadores principales

| Tarjeta | Qué muestra |
|---------|-------------|
| **Animales Activos** | Total de animales con estado "activo" |
| **Animales Vendidos** | Total de animales vendidos |
| **Animales Muertos** | Total de bajas por muerte |
| **Lotes Activos** | Cantidad de lotes en operación |
| **Establecimientos** | Cantidad de predios registrados |

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| 🔄 Actualizar | Refresca los datos manualmente |
| ➕ Nuevo Animal | Acceso rápido para registrar un animal |

### Consejos

- Los datos se actualizan automáticamente cada 30 segundos
- Las flechas verdes (↑) y rojas (↓) indican la tendencia respecto al mes anterior
- Si un indicador muestra "0", verifica que hayas registrado animales y establecimientos

---

## 6. Ganado (Animales)

### ¿Qué es?

El módulo de Ganado es el corazón de la aplicación. Aquí registras, consultas y gestionas cada animal de tu plantel con su identificación (DIIO, RFID), datos de trazabilidad, establecimiento y lote asignado.

### ¿Cómo se usa?

1. Haz clic en **"Nuevo Animal"** para registrar un animal con su DIIO y datos básicos
2. Usa la **barra de búsqueda** para encontrar animales por número de DIIO o RFID
3. **Filtra** por estado (Activo, Vendido, Muerto) con el selector de la derecha
4. Haz clic en un animal de la lista para ver su **ficha completa** con historial
5. Desde el menú de acciones (⋮) puedes editar, registrar pesaje o dar de baja

### Registrar un nuevo animal

1. Haz clic en **Nuevo Animal**
2. Completa los datos obligatorios:
   - **Especie** — Bovino (por defecto)
   - **Sexo** — Macho o Hembra
   - **Categoría** — Vaca, Novillo, Vaquilla, Toro, Ternero, etc.
   - **Establecimiento** — predio donde se encuentra
3. Completa los datos opcionales:
   - **Fecha de nacimiento**
   - **Raza**
   - **Lote** — agrupación dentro del establecimiento
   - **Padre / Madre** — para genealogía
4. Agrega identificadores:
   - **DIIO** — número del dispositivo oficial (obligatorio)
   - **RFID / Chip** — identificación electrónica (opcional)
5. Campos de trazabilidad SIPEC (opcionales):
   - RUP de origen
   - Exportable China / UE
   - PABCO
   - Uso de anabólicos
6. Haz clic en **Guardar**

### Vista detalle del animal

Al hacer clic en un animal, verás:

- **Datos generales** — especie, sexo, categoría, edad, establecimiento, lote
- **Identificadores** — DIIO, RFID, Chip
- **Gráfico de evolución de peso** — LineChart con todos los pesajes registrados
- **Estadísticas de peso** — último peso, peso máximo, peso mínimo, GDP estimado
- **Genealogía** — padre, madre y lista de crías (con links a cada animal)
- **Historial sanitario** — eventos de salud registrados

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Animal | Registrar animal con identificadores |
| 👁️ Ver detalle | Ficha completa del animal |
| ✏️ Editar | Modificar datos del animal |
| ⚖️ Registrar pesaje | Agregar peso al animal |
| 🗑️ Dar de baja | Cambiar estado a vendido/muerto |
| 📥 Exportar CSV | Descargar listado filtrado |

### Consejos

- El **DIIO** (Dispositivo de Identificación Individual Oficial) es obligatorio para cada animal ante el SAG
- Los toros pueden tener además un **chip RFID** para identificación electrónica
- **Exporta a CSV** para trabajar los datos en Excel o compartirlos con tu veterinario
- Usa los **filtros** para ver solo animales activos, vendidos o de un establecimiento específico

### Preguntas frecuentes

**¿Puedo registrar animales sin DIIO?**
Sí, pero se recomienda siempre ingresar el DIIO para mantener la trazabilidad oficial.

**¿Cómo doy de baja un animal?**
Desde el menú de acciones (⋮) del animal, selecciona "Dar de baja" e indica el motivo (venta, muerte, etc.). También puedes registrar un movimiento de tipo Venta o Muerte.

**¿Cómo registro la genealogía?**
Al crear o editar un animal, usa los selectores de "Padre" y "Madre" para vincular a los progenitores. Las crías aparecerán automáticamente en la ficha de cada padre/madre.

---

## 7. Lotes

### ¿Qué es?

Los Lotes permiten agrupar animales por criterio productivo: engorda, vacas paridas, recría, terneros, etc. Facilitan el manejo grupal de pesajes, movimientos y eventos sanitarios.

### ¿Cómo se usa?

1. Crea un lote con nombre descriptivo (ej: "Engorda Invierno 2026")
2. Asigna un establecimiento al lote
3. Desde el módulo de Ganado, asigna animales al lote
4. Consulta el peso promedio y cantidad de animales por lote

### Crear un lote

1. Ve a **Lotes** en el menú lateral
2. Haz clic en **Nuevo Lote**
3. Completa:
   - **Nombre** — nombre descriptivo del lote
   - **Establecimiento** — predio donde opera el lote
   - **Descripción** — detalle opcional (ej: "Novillos para engorda, ingreso marzo 2026")
4. Haz clic en **Guardar**

### Vista detalle del lote

Al hacer clic en un lote, verás:

- **Cantidad de animales** asignados al lote
- **Estadísticas de peso** — promedio, mínimo, máximo
- **GDP** (Ganancia Diaria de Peso) — calculada entre pesajes
- **Dispersión** — variabilidad de peso dentro del lote
- **Gráfico de evolución** — LineChart con peso promedio del lote en el tiempo

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Lote | Crear agrupación de animales |
| 👁️ Ver detalle | Animales del lote y estadísticas |
| ✏️ Editar | Cambiar nombre, descripción o establecimiento |

### Consejos

- Un animal solo puede pertenecer a **un lote a la vez**
- Usa lotes para organizar **sesiones de pesaje**: pesa un lote completo en una sesión
- Los lotes facilitan los **movimientos grupales** entre establecimientos
- Nombres descriptivos ayudan a identificar rápidamente cada grupo (ej: "Terneros Destete Otoño 2026")

### Preguntas frecuentes

**¿Puedo mover un animal de un lote a otro?**
Sí, edita el animal y cambia el lote asignado. El animal dejará el lote anterior automáticamente.

**¿Qué pasa si elimino un lote?**
Los animales del lote quedan sin lote asignado, pero no se eliminan del sistema.

---

## 8. Pesajes

### ¿Qué es?

El módulo de Pesajes organiza los registros de peso en sesiones. Cada sesión agrupa los pesajes realizados en una fecha con un equipo específico, permitiendo calcular promedios, mínimos y máximos.

### ¿Cómo se usa?

1. Crea una nueva **sesión de pesaje** indicando fecha, equipo y operador
2. Agrega **pesajes individuales** dentro de la sesión (animal + peso)
3. Opcionalmente, **importa datos** directamente desde una balanza XR5000
4. Consulta las **estadísticas** de cada sesión: promedio, mínimo, máximo
5. Compara sesiones para evaluar la **ganancia de peso** en el tiempo

### Crear una sesión de pesaje

1. Ve a **Pesajes** en el menú lateral
2. Haz clic en **Nueva Sesión**
3. Completa:
   - **Fecha** — fecha del pesaje
   - **Equipo** — balanza utilizada (ej: "XR5000", "Balanza manual")
   - **Operador** — persona que realizó el pesaje
   - **Observaciones** — notas opcionales
4. Haz clic en **Guardar**

### Registrar pesajes individuales

1. Abre una sesión de pesaje existente
2. Haz clic en **Agregar Pesaje**
3. Selecciona el animal (por DIIO o nombre)
4. Ingresa el peso en kilogramos
5. Haz clic en **Guardar**
6. Repite para cada animal pesado

### Importar desde balanza XR5000

1. Conecta la balanza XR5000 a tu computador
2. Exporta los datos desde la balanza en formato CSV o TXT
3. En la sesión de pesaje, haz clic en **Importar XR5000**
4. Selecciona el archivo exportado
5. El sistema asociará automáticamente cada peso al animal por su **RFID**
6. Revisa los datos importados y confirma

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nueva Sesión | Crear sesión de pesaje |
| ➕ Agregar Pesaje | Registrar peso individual |
| 📤 Importar XR5000 | Carga desde balanza electrónica |
| 📥 Exportar CSV | Descargar datos de pesaje |

### Consejos

- Registra pesajes periódicos (cada **15-30 días**) para monitorear la ganancia diaria de peso (GDP)
- La **importación desde XR5000** ahorra mucho tiempo al pesar lotes grandes
- El peso promedio del lote se actualiza automáticamente con cada pesaje
- Si un peso parece anómalo (muy alto o muy bajo), verifica que el animal correcto esté asociado

### Preguntas frecuentes

**¿Qué formato acepta la importación XR5000?**
Archivos CSV o TXT exportados directamente desde la balanza XR5000. El sistema lee el RFID y el peso de cada línea.

**¿Puedo editar un pesaje después de registrarlo?**
Sí, puedes corregir el peso o el animal asociado desde la sesión de pesaje.

**¿Cómo veo la evolución de peso de un animal?**
Ve a la ficha del animal (módulo Ganado → clic en el animal). Verás un gráfico con todos sus pesajes históricos.

---

## 9. Movimientos

### ¿Qué es?

Los Movimientos registran todo desplazamiento o cambio de estado del ganado: traslados entre establecimientos, ventas a terceros, compras, muertes y ajustes de inventario.

### ¿Cómo se usa?

1. Haz clic en **"Nuevo Movimiento"** y selecciona el tipo
2. Indica el establecimiento de origen y destino (según el tipo)
3. Agrega los animales involucrados en el movimiento
4. Guarda como **"Borrador"** si aún no está listo
5. **Confirma** el movimiento cuando todo esté correcto — esto actualiza la ubicación de los animales

### Tipos de movimiento

| Tipo | Descripción | Qué ocurre al confirmar |
|------|-------------|------------------------|
| **Traslado** | Mover animales entre establecimientos propios | Los animales cambian de establecimiento |
| **Venta** | Vender animales a un tercero | Los animales pasan a estado "vendido" |
| **Compra** | Incorporar animales de un tercero | Se crean nuevos animales en el sistema |
| **Muerte** | Registrar la muerte de animales | Los animales pasan a estado "muerto" |
| **Ajuste** | Corrección de inventario | Ajusta cantidades sin movimiento físico |

### Estados del movimiento

| Estado | Significado |
|--------|-------------|
| **Borrador** | En preparación, se puede editar libremente |
| **Confirmado** | Ejecutado, los animales fueron actualizados |
| **Informado** | Reportado a SIPEC/SAG (futuro) |

### Crear un movimiento

1. Ve a **Movimientos** en el menú lateral
2. Haz clic en **Nuevo Movimiento**
3. Selecciona el **tipo** (Traslado, Venta, Compra, Muerte, Ajuste)
4. Completa:
   - **Fecha** del movimiento
   - **Establecimiento de origen** — de dónde salen los animales
   - **Establecimiento de destino** — a dónde llegan (para traslados y compras)
   - **Titular de origen / destino** — propietarios involucrados
5. **Agrega animales** al movimiento usando el selector
6. Adjunta **documentos** si corresponde (guía de despacho, factura)
7. Guarda como **Borrador** o **Confirma** directamente

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Movimiento | Registrar traslado, venta, compra o muerte |
| 👁️ Ver detalle | Animales y documentos del movimiento |
| ✅ Confirmar | Ejecutar el movimiento y actualizar ubicaciones |

### Consejos

- Usa **"Borrador"** para preparar movimientos con anticipación
- Al confirmar un traslado, los animales **cambian automáticamente** de establecimiento
- Las ventas confirmadas se reflejan en el módulo **Financiero**
- Cada movimiento queda registrado como **trazabilidad** del animal
- Adjunta siempre la **guía de despacho** para respaldo legal

### Preguntas frecuentes

**¿Puedo revertir un movimiento confirmado?**
No directamente. Debes crear un nuevo movimiento en sentido contrario (ej: un traslado de vuelta).

**¿Los documentos adjuntos son obligatorios?**
No son obligatorios en el sistema, pero se recomienda adjuntar la guía de despacho para cumplimiento normativo.

---

## 10. Reportes

### ¿Qué es?

El módulo de Reportes genera informes y estadísticas de tu operación ganadera. Permite consultar stock, movimientos y pesajes por período, con opción de exportar a CSV.

### ¿Cómo se usa?

1. Ve a **Reportes** en el menú lateral
2. Selecciona la pestaña del reporte que necesitas: **Stock**, **Movimientos** o **Pesajes**
3. Ajusta el **rango de fechas** con los selectores "Desde" y "Hasta"
4. Consulta los datos en la tabla
5. Haz clic en **Exportar CSV** para descargar el reporte

### Reportes disponibles

#### Reporte de Stock

Muestra el inventario actual de animales por establecimiento:

- Total de animales activos
- Distribución por categoría (vacas, novillos, terneros, etc.)
- Distribución por establecimiento
- Comparación con período anterior

#### Reporte de Movimientos

Muestra los movimientos registrados en un período:

- Cantidad de movimientos por tipo (traslado, venta, compra, muerte)
- Animales involucrados
- Establecimientos de origen y destino
- Estado de cada movimiento

#### Reporte de Pesajes

Muestra las sesiones de pesaje y estadísticas:

- Sesiones realizadas en el período
- Peso promedio, mínimo y máximo
- **GDP estimado** (Ganancia Diaria de Peso)
- Cantidad de animales pesados

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| 📅 Filtrar por fecha | Ajustar período del reporte |
| 📥 Exportar CSV | Descargar datos en formato Excel |
| 🔄 Actualizar | Refrescar datos del reporte |

### Consejos

- El **GDP** se calcula comparando el peso promedio entre la primera y última sesión del período
- Los reportes de **Stock** son útiles para preparar la Declaración de Existencias Animales (DEA) del SAG
- Exporta a CSV y abre en Excel para análisis más detallados o gráficos personalizados

---

## 11. Sanitario

### ¿Qué es?

El módulo Sanitario gestiona todos los eventos de salud animal: vacunaciones, tratamientos, desparasitaciones, exámenes y cirugías. Incluye un calendario de próximos eventos para no olvidar ninguna dosis.

### ¿Cómo se usa?

1. Haz clic en **"Nuevo Evento"** para registrar una vacunación o tratamiento
2. Selecciona el tipo, producto, dosis, vía de aplicación y veterinario
3. Indica la **fecha de próxima dosis** si corresponde
4. Consulta la pestaña **"Próximos"** para ver los eventos programados en los próximos 30 días
5. Los eventos vencidos se marcan automáticamente en rojo

### Registrar un evento sanitario

1. Ve a **Sanitario** en el menú lateral
2. Haz clic en **Nuevo Evento**
3. Completa:
   - **Animal** — selecciona el animal por DIIO
   - **Tipo de evento** — Vacunación, Tratamiento, Desparasitación, Examen, Cirugía
   - **Producto** — nombre del medicamento o vacuna
   - **Dosis** — cantidad aplicada
   - **Vía de aplicación** — Intramuscular, Subcutánea, Oral, etc.
   - **Veterinario** — profesional responsable
   - **Lote de producto** — número de lote del medicamento (para trazabilidad)
   - **Fecha de próxima dosis** — si requiere refuerzo
   - **Período de resguardo** — días que el animal no puede ser comercializado
4. Haz clic en **Guardar**

### Calendario sanitario

La pestaña **"Próximos 30 días"** muestra los eventos programados con código de colores:

| Color | Significado |
|-------|-------------|
| 🔴 Rojo | Evento vencido o en los próximos 3 días (urgente) |
| 🟡 Amarillo | Evento en los próximos 7 días (atención) |
| 🔵 Azul | Evento en más de 7 días (programado) |

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Evento | Registrar vacunación, tratamiento, etc. |
| 📅 Próximos | Ver calendario de eventos programados |
| 📥 Exportar CSV | Descargar historial sanitario |

### Consejos

- **Programa siempre** la fecha de próxima dosis para recibir alertas automáticas
- Los colores en el calendario indican urgencia — revisa los rojos primero
- Registra el **período de resguardo** para controlar cuándo un animal puede ser comercializado
- El campo **"Lote de producto"** ayuda a rastrear el lote de la vacuna utilizada (exigido por SAG)

### Preguntas frecuentes

**¿Puedo ver todo el historial sanitario de un animal?**
Sí, ve a la ficha del animal (módulo Ganado → clic en el animal) y encontrarás la sección de historial sanitario.

**¿Las alertas sanitarias son automáticas?**
Sí, el sistema genera alertas automáticas cuando un evento sanitario está próximo a vencer o ya venció. Asegúrate de tener las alertas sanitarias activadas en Configuración → Alertas.

---

## 12. Financiero

### ¿Qué es?

El módulo Financiero registra todos los costos operativos y las ventas de ganado. Calcula automáticamente la rentabilidad y muestra la distribución de gastos por categoría.

### ¿Cómo se usa?

1. En la pestaña **"Costos"**, registra gastos de alimentación, sanitario, mano de obra, transporte, etc.
2. En la pestaña **"Ventas"**, registra cada venta con comprador, cantidad, precio y forma de pago
3. Las **tarjetas superiores** muestran: Total Costos, Total Ventas, Rentabilidad y Ventas Pendientes
4. El **gráfico circular** muestra cómo se distribuyen tus costos por categoría
5. Marca las ventas como **"Pagada"** cuando recibas el pago

### Registrar un costo

1. Ve a **Financiero** → pestaña **Costos**
2. Haz clic en **Nuevo Costo**
3. Completa:
   - **Tipo** — Alimentación, Sanitario, Mano de obra, Transporte, Infraestructura, Otro
   - **Concepto** — descripción del gasto (ej: "Fardo alfalfa x100")
   - **Monto** — valor en pesos chilenos
   - **Fecha** — fecha del gasto
   - **Proveedor** — nombre del proveedor (opcional)
   - **Documento** — número de factura o boleta (opcional)
4. Haz clic en **Guardar**

### Registrar una venta

1. Ve a **Financiero** → pestaña **Ventas**
2. Haz clic en **Nueva Venta**
3. Completa:
   - **Comprador** — nombre del comprador
   - **Cantidad de animales** — cuántos animales se vendieron
   - **Precio unitario** — precio por animal
   - **Forma de pago** — Efectivo, Transferencia, Cheque, Crédito
   - **Estado de pago** — Pagada o Pendiente
   - **Factura** — número de documento tributario (opcional)
4. El **precio total** se calcula automáticamente (cantidad × precio unitario)
5. Haz clic en **Guardar**

### Indicadores financieros

| Tarjeta | Qué muestra |
|---------|-------------|
| **Total Costos** | Suma de todos los gastos registrados |
| **Total Ventas** | Suma de todas las ventas |
| **Rentabilidad** | Total Ventas − Total Costos |
| **Pendientes de Cobro** | Ventas con estado "Pendiente" |

### Acciones disponibles

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Costo | Registrar gasto operativo |
| ➕ Nueva Venta | Registrar venta de ganado |
| 📥 Exportar CSV | Descargar costos o ventas |

### Consejos

- Registra **todos los costos**, incluso los pequeños, para tener una rentabilidad real
- El precio total de la venta se calcula automáticamente (cantidad × precio unitario)
- Usa el campo **"Factura"** para vincular el número de documento tributario
- La **rentabilidad** = Total Ventas − Total Costos
- Marca las ventas como **"Pagada"** para llevar control de cobros pendientes

### Preguntas frecuentes

**¿Las ventas del módulo Financiero se vinculan con los Movimientos?**
Las ventas confirmadas en Movimientos se reflejan en el módulo Financiero. También puedes registrar ventas directamente aquí.

**¿Puedo ver la rentabilidad por lote?**
Actualmente la rentabilidad es global. La rentabilidad por lote es una funcionalidad planificada para futuras versiones.

---

## 13. Notificaciones y Alertas

### Centro de notificaciones

El centro de notificaciones se encuentra en la **campana** de la barra superior. Muestra un badge rojo con la cantidad de alertas pendientes.

Al hacer clic en la campana:

- Verás la lista de notificaciones ordenadas por fecha
- Cada notificación indica el tipo (sanitario, ventas, movimientos) y el detalle
- Puedes **marcar como leída** cada notificación individual
- Puedes **limpiar todas** las notificaciones

### Alertas automáticas

El sistema genera alertas automáticas para:

| Categoría | Alerta |
|-----------|--------|
| **Sanitario** | Eventos sanitarios vencidos o que vencen hoy |
| **Ventas** | Ventas con estado de pago "Pendiente" |
| **Movimientos** | Movimientos en estado "Borrador" sin confirmar |

### Configurar alertas

1. Ve a **Configuración → Alertas**
2. Activa o desactiva cada categoría con el switch correspondiente
3. Los cambios se guardan automáticamente

### Consejos

- Revisa las notificaciones al menos una vez al día
- Las alertas sanitarias son las más críticas — no ignores los eventos vencidos
- El sistema almacena un máximo de 50 notificaciones (las más antiguas se eliminan automáticamente)

---

## 14. Funciones Transversales

### Exportación CSV

La mayoría de los módulos permiten exportar datos a formato CSV (compatible con Excel):

1. Aplica los **filtros** que desees (estado, fecha, establecimiento, etc.)
2. Haz clic en el botón **Exportar CSV** (ícono de descarga)
3. Se descargará un archivo `.csv` con los datos filtrados
4. Abre el archivo en Excel, Google Sheets o cualquier hoja de cálculo

> **Importante:** La exportación respeta los filtros activos. Si quieres exportar todo, asegúrate de quitar los filtros primero.

**Módulos con exportación CSV:**
- Ganado (listado de animales)
- Pesajes (datos de sesiones)
- Sanitario (historial de eventos)
- Financiero (costos y ventas)
- Reportes (stock, movimientos, pesajes)

### Modo Offline (sin conexión)

Mi Ganado funciona en modo offline para que puedas trabajar en terreno sin conexión a internet:

**¿Cómo funciona?**

1. Cuando pierdes conexión, la app sigue funcionando normalmente
2. Los datos que registres se guardan localmente en tu dispositivo
3. Cuando recuperes conexión, los datos se **sincronizan automáticamente** con el servidor
4. Un indicador en pantalla te muestra si estás online u offline

**¿Qué puedo hacer sin conexión?**

- Consultar datos previamente cargados (animales, lotes, pesajes)
- Registrar nuevos pesajes
- Registrar eventos sanitarios
- Crear movimientos en borrador

**¿Qué necesita conexión?**

- Confirmar movimientos
- Exportar CSV
- Ver datos actualizados de otros usuarios

### Uso en celular y tablet (Responsive)

La aplicación está optimizada para pantallas pequeñas:

- **Menú lateral** se convierte en menú deslizable (Sheet)
- **Tablas** se convierten en tarjetas apiladas para mejor lectura
- **Filtros** se adaptan al ancho de la pantalla
- **Paginación** usa flechas compactas
- **Gráficos** se redimensionan automáticamente
- **Barras de acción** se colapsan en menús desplegables

> **Consejo:** Para la mejor experiencia en celular, instala la app como PWA (ver sección [Instalar como App](#instalar-como-app-pwa)).

---

## 15. Glosario

| Término | Significado |
|---------|-------------|
| **DIIO** | Dispositivo de Identificación Individual Oficial. Arete plástico obligatorio para cada bovino, asignado por el SAG |
| **RFID** | Radio-Frequency Identification. Chip electrónico para identificación automática de animales |
| **RUP** | Rol Único Pecuario. Código que identifica cada predio ganadero ante el SAG |
| **RUT** | Rol Único Tributario. Identificación fiscal del propietario |
| **SAG** | Servicio Agrícola y Ganadero. Organismo del Estado que regula la actividad pecuaria en Chile |
| **SIPEC** | Sistema de Información Pecuaria. Plataforma oficial del SAG para trazabilidad animal |
| **DEA** | Declaración de Existencias Animales. Declaración anual obligatoria ante el SAG |
| **GDP** | Ganancia Diaria de Peso. Indicador que mide cuántos kilos gana un animal por día |
| **XR5000** | Modelo de balanza electrónica para pesaje de ganado, con lectura RFID integrada |
| **PWA** | Progressive Web App. Tecnología que permite instalar la web como aplicación nativa |
| **CSV** | Comma-Separated Values. Formato de archivo compatible con Excel para exportar datos |
| **PABCO** | Planteles Animales Bajo Certificación Oficial. Programa del SAG para predios certificados |
| **Lote** | Agrupación operativa de animales dentro de un establecimiento |
| **Sesión de pesaje** | Evento de pesaje grupal en una fecha específica con un equipo determinado |
| **Movimiento** | Registro de traslado, venta, compra, muerte o ajuste de inventario |
| **Borrador** | Estado de un movimiento que aún no ha sido confirmado (editable) |
| **Confirmado** | Estado de un movimiento ejecutado (los animales fueron actualizados) |
| **Período de resguardo** | Días posteriores a un tratamiento en que el animal no puede ser comercializado |
| **Titular** | Persona natural o empresa propietaria del ganado |
| **Establecimiento** | Predio o campo ganadero registrado con RUP |

---

## 16. Soporte y Contacto

### ¿Necesitas ayuda?

**Dentro de la aplicación:**
- Ve a **Ayuda** en el menú lateral para consultar la guía interactiva de cada módulo
- Usa la barra de búsqueda en la página de Ayuda para encontrar respuestas rápidas

**Contacto del equipo:**
- 📧 Email: contacto@miganado.cl
- 🌐 Web: www.miganado.cl
- 📱 WhatsApp: +56 9 XXXX XXXX

### Horario de soporte

| Tipo | Horario | Tiempo de respuesta |
|------|---------|-------------------|
| **Soporte general** | Lunes a Viernes, 9:00 - 18:00 | 4 horas |
| **Soporte preferencial** | Lunes a Viernes, 9:00 - 18:00 | 2 horas |
| **Emergencias (caída del sistema)** | 24/7 | Inmediato |

### Reportar un problema

Si encuentras un error o comportamiento inesperado:

1. Describe qué estabas haciendo cuando ocurrió el problema
2. Indica qué dispositivo y navegador usas
3. Si es posible, toma una captura de pantalla
4. Envía la información al equipo de soporte por email o WhatsApp

---

*Manual de Usuario — Mi Ganado v1.0*  
*Última actualización: 2026-02-11*  
*Este documento se actualiza con cada nueva versión de la plataforma*
