# Instrucciones de Importación - Maria Auad

## Resumen

Este documento describe los pasos para ejecutar la migración de base de datos y la importación de datos de Maria Auad.

---

## Pre-requisitos

1. Base de datos PostgreSQL configurada
2. Variables de entorno configuradas en `.env`
3. Dependencias instaladas (`npm install`)

---

## Paso 1: Ejecutar Migración

### Opción A: Usando Prisma Migrate (Desarrollo)

```bash
cd /Users/ja/Documents/GitHub/backend-agente
npx prisma migrate dev --name add_trazabilidad_fields
```

### Opción B: Aplicar SQL Directamente (Producción)

```bash
cd /Users/ja/Documents/GitHub/backend-agente
npx prisma migrate deploy
```

### Opción C: Ejecutar SQL Manual

Ejecutar el archivo SQL directamente en la base de datos:

```bash
psql $DATABASE_URL < prisma/migrations/20260203_add_trazabilidad_fields/migration.sql
```

---

## Paso 2: Regenerar Prisma Client

```bash
cd /Users/ja/Documents/GitHub/backend-agente
npx prisma generate
```

---

## Paso 3: Ejecutar Script de Importación

### Antes de ejecutar:

1. **Actualizar RUT del titular** en `scripts/import-maria-auad.ts`:
   ```typescript
   const TITULAR_RUT = 'XX.XXX.XXX-X'; // Reemplazar con RUT real
   ```

2. **Verificar ruta del Excel**:
   ```typescript
   const EXCEL_PATH = path.join(__dirname, '../../mi-ganado/docs/mariaauad/INVENTARIO 16-01-26.xlsx');
   ```

### Ejecutar:

```bash
cd /Users/ja/Documents/GitHub/backend-agente
npx ts-node scripts/import-maria-auad.ts
```

---

## Paso 4: Verificar Importación

### Verificar conteos en base de datos:

```sql
-- Total animales
SELECT COUNT(*) FROM animal;

-- Animales por establecimiento
SELECT e.nombre, e.rol_predial, COUNT(a.id) as total
FROM animal a
JOIN establecimiento e ON a.establecimiento_actual_id = e.id
GROUP BY e.id
ORDER BY total DESC;

-- Animales por categoría
SELECT categoria, COUNT(*) as total
FROM animal
GROUP BY categoria
ORDER BY total DESC;

-- Animales por raza
SELECT r.nombre, COUNT(a.id) as total
FROM animal a
JOIN raza r ON a.raza_id = r.id
GROUP BY r.id
ORDER BY total DESC;

-- Total identificadores
SELECT tipo, COUNT(*) as total
FROM identificador
GROUP BY tipo;

-- Total manejos sanitarios
SELECT COUNT(*) FROM manejo_sanitario;
```

---

## Archivos Creados

### Documentación (`mi-ganado/docs/mariaauad/`)
- `ANALISIS-EXCEL.md` - Análisis detallado del Excel
- `MAPEO-CAMPOS.md` - Mapeo de campos Excel → Prisma
- `DATOS-MAESTROS.md` - Datos de titular, establecimientos y razas
- `INSTRUCCIONES-IMPORTACION.md` - Este archivo

### Backend (`backend-agente/`)
- `prisma/schema.prisma` - Actualizado con nuevos campos
- `prisma/migrations/20260203_add_trazabilidad_fields/migration.sql` - SQL de migración
- `scripts/import-maria-auad.ts` - Script de importación

### Frontend (`mi-ganado/`)
- `src/types/index.ts` - Actualizado con nuevos tipos

---

## Cambios en el Modelo de Datos

### Nuevo Enum: CategoriaAnimal
```
TERNERO, TERNERA, NOVILLO, VAQUILLA, TORO, TORITO, VACA, BUEY
```

### Nuevos Campos en Animal
| Campo | Tipo | Descripción |
|-------|------|-------------|
| categoria | CategoriaAnimal? | Categoría del animal |
| rupOrigen | String? | RUP de nacimiento |
| rupUltimoMovimiento | String? | Último RUP de movimiento |
| exportableChina | Boolean | Exportable a China |
| exportableUE | Boolean | Exportable a UE |
| pabco | Boolean | Certificación PABCO |
| trazabilidadNacimiento | Boolean | Trazabilidad desde nacimiento |
| trazabilidadCompleta | Boolean | Trazabilidad completa |
| usoAnabolicos | Boolean | Uso de anabólicos |
| usoMedicamentoNoPermitido | Boolean | Medicamentos no permitidos |

### Nuevo Campo en Identificador
| Campo | Tipo | Descripción |
|-------|------|-------------|
| fechaSipec | DateTime? | Fecha de identificación SIPEC |

### Nuevo Modelo: ManejoSanitario
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | UUID |
| animalId | String | FK a Animal |
| fecha | DateTime | Fecha del manejo |
| descripcion | String? | Descripción del tratamiento |
| rup | String? | RUP donde se realizó |

---

## Datos a Importar

| Entidad | Cantidad |
|---------|----------|
| Titular | 1 |
| Establecimientos | 7 |
| Razas | 10 |
| Animales | ~1,730 |
| Identificadores DIIO | ~1,730 |
| Chips (Toros) | 70 |
| Manejos Sanitarios | ~1,224 |

---

## Troubleshooting

### Error: "Cannot find module 'xlsx'"
```bash
npm install xlsx
```

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Migration failed"
Verificar que la base de datos esté accesible y que las tablas no tengan datos conflictivos.

### Error: "DIIO duplicado"
El script maneja DIIOs duplicados saltándolos. Verificar en la hoja `cambio_diio` si hay cambios de DIIO.

---

## Contacto

Para dudas sobre la importación, revisar:
- Documentación en `/mi-ganado/docs/mariaauad/`
- Plan original en `/.windsurf/plans/maria-auad-data-import-6145e0.md`
