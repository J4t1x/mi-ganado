# Datos Maestros - Maria Auad

## Titular

```json
{
  "rut": "PENDIENTE_OBTENER",
  "nombreRazonSocial": "MARIA ERCIRA AUAD",
  "tipo": "PERSONA_NATURAL",
  "contacto": null,
  "estado": "ACTIVO"
}
```

> **Nota:** El RUT debe ser proporcionado por la clienta para completar el registro.

---

## Establecimientos (7 RUPs Principales)

| # | RUP | Nombre | Tipo | Animales | Estado |
|---|-----|--------|------|----------|--------|
| 1 | 11.1.01.1241 | STA MARIA 2 | PROPIO | 780 | ACTIVO |
| 2 | 11.2.01.0038 | ANITA | PROPIO | 338 | ACTIVO |
| 3 | 11.1.01.0791 | ANITA | PROPIO | 265 | ACTIVO |
| 4 | 11.1.01.0941 | SIERRA COLORADA | PROPIO | 157 | ACTIVO |
| 5 | 11.1.01.0893 | SAN CARLOS | PROPIO | 148 | ACTIVO |
| 6 | 11.1.01.2304 | SAN ELIAS | PROPIO | 34 | ACTIVO |
| 7 | 11.1.01.1240 | DOS TORDILLOS | PROPIO | 5 | ACTIVO |

### Detalle de Establecimientos

```json
[
  {
    "rolPredial": "11.1.01.1241",
    "nombre": "STA MARIA 2",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.2.01.0038",
    "nombre": "ANITA",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.1.01.0791",
    "nombre": "ANITA",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.1.01.0941",
    "nombre": "SIERRA COLORADA",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.1.01.0893",
    "nombre": "SAN CARLOS",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.1.01.2304",
    "nombre": "SAN ELIAS",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  },
  {
    "rolPredial": "11.1.01.1240",
    "nombre": "DOS TORDILLOS",
    "tipo": "PROPIO",
    "ubicacion": "Región de Aysén",
    "estado": "ACTIVO"
  }
]
```

### Establecimientos de Nacimiento (Adicionales)

Estos establecimientos aparecen como lugar de nacimiento pero pueden no ser propiedad de Maria Auad:

| Establecimiento | Animales Nacidos |
|-----------------|------------------|
| STA MARIA 2 | 754 |
| ANITA | 576 |
| SIERRA COLORADA | 93 |
| SAN CARLOS | 76 |
| DOS TORDILLOS | 43 |
| SAN ELIAS | 38 |
| SAN JUAN | 37 |
| SAN GABRIEL | 33 |
| AGUAS FRESCAS | 25 |
| FDO EL ABUELO | 21 |
| Otros | ~31 |

---

## Razas (11 Razas Bovinas)

| # | Nombre | Especie | Cantidad | Descripción |
|---|--------|---------|----------|-------------|
| 1 | ANGUS NEGRO | BOVINO | 2,800 | Raza principal |
| 2 | ANGUS ROJO | BOVINO | 501 | Segunda raza |
| 3 | HEREFORD | BOVINO | 138 | Raza británica |
| 4 | OVERO COLORADO (CLAVEL ALEMAN) | BOVINO | 71 | Raza mixta |
| 5 | LIMOUSIN | BOVINO | 26 | Raza francesa |
| 6 | OVERO NEGRO | BOVINO | 19 | Raza mixta |
| 7 | POLLED HEREFORD | BOVINO | 8 | Hereford sin cuernos |
| 8 | HIBRIDO | BOVINO | 3 | Cruce de razas |
| 9 | CLAVEL CHILENO | BOVINO | 1 | Raza local |
| 10 | SHORTON | BOVINO | 1 | Shorthorn |

### Detalle de Razas

```json
[
  {
    "nombre": "ANGUS NEGRO",
    "especie": "BOVINO",
    "descripcion": "Raza británica de carne, pelaje negro sólido"
  },
  {
    "nombre": "ANGUS ROJO",
    "especie": "BOVINO",
    "descripcion": "Variante roja de la raza Angus"
  },
  {
    "nombre": "HEREFORD",
    "especie": "BOVINO",
    "descripcion": "Raza británica de carne, cara blanca característica"
  },
  {
    "nombre": "OVERO COLORADO (CLAVEL ALEMAN)",
    "especie": "BOVINO",
    "descripcion": "Raza mixta con manchas coloradas"
  },
  {
    "nombre": "LIMOUSIN",
    "especie": "BOVINO",
    "descripcion": "Raza francesa de carne, pelaje dorado"
  },
  {
    "nombre": "OVERO NEGRO",
    "especie": "BOVINO",
    "descripcion": "Raza mixta con manchas negras"
  },
  {
    "nombre": "POLLED HEREFORD",
    "especie": "BOVINO",
    "descripcion": "Hereford sin cuernos (mocho)"
  },
  {
    "nombre": "HIBRIDO",
    "especie": "BOVINO",
    "descripcion": "Cruce de diferentes razas"
  },
  {
    "nombre": "CLAVEL CHILENO",
    "especie": "BOVINO",
    "descripcion": "Raza local chilena"
  },
  {
    "nombre": "SHORTON",
    "especie": "BOVINO",
    "descripcion": "Shorthorn, raza británica de doble propósito"
  }
]
```

---

## Resumen de Animales a Importar

### Por Categoría (Animales Vivos)

| Categoría | Cantidad |
|-----------|----------|
| VACA | ~750 |
| NOVILLO | ~400 |
| VAQUILLA | ~350 |
| TORO | ~100 |
| TERNERO | ~70 |
| TERNERA | ~55 |
| BUEY | ~5 |
| **Total** | **~1,730** |

### Por Establecimiento

| Establecimiento | Cantidad |
|-----------------|----------|
| STA MARIA 2 (11.1.01.1241) | 780 |
| ANITA (11.2.01.0038) | 338 |
| ANITA (11.1.01.0791) | 265 |
| SIERRA COLORADA (11.1.01.0941) | 157 |
| SAN CARLOS (11.1.01.0893) | 148 |
| SAN ELIAS (11.1.01.2304) | 34 |
| DOS TORDILLOS (11.1.01.1240) | 5 |
| Otros | 3 |
| **Total** | **~1,730** |

---

## Identificadores

### DIIO (Dispositivo de Identificación Individual Oficial)
- **Tipo:** DIIO_VISUAL
- **Cantidad:** ~1,730 (uno por animal)
- **Formato:** Número de 6-8 dígitos

### Chips RFID (Solo Toros)
- **Tipo:** CHIP
- **Cantidad:** 70
- **Formato:** Número de 7 dígitos

---

## Manejos Sanitarios 2025

- **Total registros:** 1,224
- **DIIOs únicos:** 841
- **Período:** Enero 2025 - Noviembre 2025

### Tipos de Tratamientos Registrados
- Covexin 10 - 2ml
- Virbamec F - 10ml
- Vit-E-Selenio - 10ml
- Clostribac 8 Gold - 2ml
- Palpaciones (rechazo)

---

## Checklist de Importación

- [ ] Obtener RUT de Maria Auad
- [ ] Crear titular en sistema
- [ ] Crear 7 establecimientos principales
- [ ] Crear 10 razas bovinas
- [ ] Importar ~1,730 animales vivos
- [ ] Asignar identificadores DIIO
- [ ] Asignar chips a 70 toros
- [ ] Importar 1,224 manejos sanitarios
- [ ] Validar conteos por establecimiento
- [ ] Validar conteos por categoría
