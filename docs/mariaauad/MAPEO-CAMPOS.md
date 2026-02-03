# Mapeo de Campos Excel → Modelo Prisma

## Resumen

Este documento detalla el mapeo entre los campos del Excel de Maria Auad y el modelo de datos actual en Prisma, identificando campos existentes, faltantes y transformaciones necesarias.

---

## Campos que YA EXISTEN en el Modelo

| Campo Excel | Campo Prisma | Tabla | Transformación |
|-------------|--------------|-------|----------------|
| `DIIO` | `codigo` | `identificador` | tipo: DIIO_VISUAL |
| `Sexo` (M/H) | `sexo` | `animal` | M→MACHO, H→HEMBRA |
| `Fecha_Nacimiento` | `fechaNacimiento` | `animal` | Parsear fecha |
| `Estado` (Vivo/Muerto) | `estado` | `animal` | Vivo→ACTIVO, Muerto→MUERTO |
| `Raza` | `nombre` | `raza` | Buscar/crear raza, asignar razaId |
| `Rup_Actual` | `rolPredial` | `establecimiento` | Buscar/crear establecimiento |
| `chip` | `codigo` | `identificador` | tipo: CHIP |
| `Nombre_Predio` | `nombre` | `establecimiento` | - |
| `Nombre_Titular` | `nombreRazonSocial` | `titular` | - |

---

## Campos NUEVOS a Agregar

### En modelo `Animal`

| Campo Excel | Campo Prisma | Tipo | Default | Descripción |
|-------------|--------------|------|---------|-------------|
| `Clase` | `categoria` | `CategoriaAnimal?` | null | VACA, TORO, NOVILLO, etc. |
| `Rup_Origen` | `rupOrigen` | `String?` | null | RUP donde nació |
| `RUP_ultimo_movimiento` | `rupUltimoMovimiento` | `String?` | null | Último RUP de movimiento |
| `Exportable_CHINA` | `exportableChina` | `Boolean` | false | SI→true, NO→false |
| `Exportable_UE` | `exportableUE` | `Boolean` | false | SI→true, NO→false |
| `PABCO` | `pabco` | `Boolean` | false | Certificación PABCO |
| `Trazabilidad_Nacimiento` | `trazabilidadNacimiento` | `Boolean` | false | Trazabilidad desde nacimiento |
| `Trazabilidad_Completa` | `trazabilidadCompleta` | `Boolean` | false | Trazabilidad completa |
| `Uso_Anabolicos` | `usoAnabolicos` | `Boolean` | false | Uso de anabólicos |
| `Uso_Medicamento_No_Permitido` | `usoMedicamentoNoPermitido` | `Boolean` | false | Medicamentos no permitidos |

### En modelo `Identificador`

| Campo Excel | Campo Prisma | Tipo | Default | Descripción |
|-------------|--------------|------|---------|-------------|
| `fecha ident sipec` | `fechaSipec` | `DateTime?` | null | Fecha identificación SIPEC |

### Nuevo modelo `ManejoSanitario`

| Campo Excel | Campo Prisma | Tipo | Descripción |
|-------------|--------------|------|-------------|
| `DIIO` | `animalId` | `String` | FK a animal (via DIIO) |
| `FECHA` | `fecha` | `DateTime` | Fecha del manejo |
| `RUP` | `rup` | `String?` | RUP donde se realizó |
| Descripción | `descripcion` | `String?` | Tratamiento aplicado |

---

## Nuevo Enum: CategoriaAnimal

```prisma
enum CategoriaAnimal {
  TERNERO
  TERNERA
  NOVILLO
  VAQUILLA
  TORO
  TORITO
  VACA
  BUEY
}
```

### Mapeo de valores Excel → Enum

| Valor Excel | Valor Enum |
|-------------|------------|
| TERNERO | TERNERO |
| TERNERA | TERNERA |
| NOVILLO | NOVILLO |
| VAQUILLA | VAQUILLA |
| TORO | TORO |
| TORITO | TORITO |
| VACA | VACA |
| BUEY | BUEY |
| no existe | null |

---

## Transformaciones de Datos

### Sexo
```typescript
const mapSexo = (valor: string): SexoAnimal | null => {
  if (valor === 'M') return 'MACHO';
  if (valor === 'H') return 'HEMBRA';
  return null;
};
```

### Estado
```typescript
const mapEstado = (valor: string): EstadoAnimal => {
  if (valor === 'Vivo') return 'ACTIVO';
  if (valor === 'Muerto') return 'MUERTO';
  return 'ACTIVO';
};
```

### Booleanos (SI/NO)
```typescript
const mapBoolean = (valor: string): boolean => {
  return valor === 'SI';
};
```

### Fecha
```typescript
const mapFecha = (valor: string): Date | null => {
  if (!valor || valor === 'no existe') return null;
  // Formato: "15-10-2005" o "2025-11-05"
  const parts = valor.split('-');
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return new Date(valor);
  } else {
    // DD-MM-YYYY
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
};
```

---

## Relaciones a Crear

### Animal → Raza
1. Buscar raza por nombre en tabla `raza`
2. Si no existe, crear nueva raza
3. Asignar `razaId` al animal

### Animal → Establecimiento
1. Buscar establecimiento por `rolPredial` (RUP)
2. Si no existe, crear nuevo establecimiento
3. Asignar `establecimientoActualId` al animal

### Animal → Titular
1. Buscar titular por nombre
2. Si no existe, crear nuevo titular
3. Asignar `titularActualId` al animal

### Identificador → Animal
1. Crear animal primero
2. Crear identificador con `animalId`
3. Tipo: DIIO_VISUAL para DIIO, CHIP para chips

---

## Campos Calculados

### Edad
- **No importar:** Se calcula desde `fechaNacimiento`
- Fórmula: `(fechaActual - fechaNacimiento) / 365.25`

---

## Campos Ignorados

| Campo Excel | Razón |
|-------------|-------|
| `Edad` | Calculable desde fechaNacimiento |
| `Cantidad_Titulares` | No relevante para el sistema |
| `Estado_RUP_Actual` | Información del establecimiento, no del animal |
| `manejo 2020-2024` | Fechas sin descripción, poco útiles |

---

## Orden de Importación

1. **Titular** - Crear Maria Auad
2. **Establecimientos** - Crear 7 RUPs principales
3. **Razas** - Crear 11 razas bovinas
4. **Animales** - Crear con campos básicos
5. **Identificadores** - DIIO y Chips
6. **Manejos Sanitarios** - Registros de 2025
