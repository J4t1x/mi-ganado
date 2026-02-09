# Análisis del Excel INVENTARIO 16-01-26.xlsx

## Resumen General

Archivo Excel de la clienta **Maria Ercira Auad** con datos de ganado bovino provenientes de SIPEC/SINAP y registros propios de manejos sanitarios.

- **Fecha del inventario:** 16 de enero de 2026
- **Total de hojas:** 9
- **Fuentes de datos:** SIPEC, SINAP, Stick Reader

---

## Estructura del Excel

### Hoja 1: `td` (Tabla Dinámica)
- **Registros:** Resumen
- **Descripción:** Tabla dinámica con conteo de animales por RUP y clase (TERNERA/TERNERO)
- **Uso:** Solo referencia, no importar

### Hoja 2: `tros(as)` (Terneros/as)
- **Registros:** 389
- **Descripción:** Listado de terneros y terneras con datos básicos
- **Columnas principales:**
  - DIIO
  - chip toro
  - cambio diio (antiguo)
  - manejo 2020-2025
  - Sexo, Clase, Raza
  - Edad, Fecha_Nacimiento
  - Estado, Rup_Actual
  - RUP_ultimo_movimiento, Rup_Origen
  - Exportable_CHINA
  - fecha ident sipec

### Hoja 3: `inventario` (Principal)
- **Registros:** 2,083
- **Descripción:** Inventario completo con historial de manejos sanitarios
- **Columnas (20):**
  1. DIIO
  2. chip toro
  3. cambio diio (antiguo)
  4. manejo 2020
  5. manejo 2021
  6. manejo 2022
  7. manejo 2023
  8. manejo 2024
  9. manejo 2025
  10. Sexo
  11. Clase
  12. Raza
  13. Edad
  14. Fecha_Nacimiento
  15. Estado
  16. Rup_Actual
  17. RUP_ultimo_movimiento
  18. Rup_Origen
  19. Exportable_CHINA
  20. fecha ident sipec

### Hoja 4: `predios sipec al 16-01-26`
- **Registros:** 1,727
- **Descripción:** Datos oficiales de SIPEC por predio
- **Columnas:**
  - NUMERO_DIIO
  - RAZA
  - CATEGORIA
  - FECHA_NACIMIENTO
  - ESTABLECIMIENTO_NACIDO
  - SEXO
  - GLOSA_PABCO
  - rup

### Hoja 5: `iden_sipec`
- **Registros:** 2,325
- **Descripción:** Identificaciones registradas en SIPEC
- **Columnas:**
  - DIIO
  - sexo
  - raza
  - fecha nac.
  - fecha fiio
  - rup

### Hoja 6: `chip_toros`
- **Registros:** 70
- **Descripción:** Chips RFID asignados a toros
- **Columnas:**
  - DIIO
  - diio antiguo
  - chip

### Hoja 7: `cambio_diio`
- **Registros:** 150
- **Descripción:** Historial de cambios de DIIO
- **Columnas:**
  - DIIO NUEVO
  - DIIO ANTIGUO
  - FECHA CAMBIO
  - rup

### Hoja 8: `sinap` (Datos Completos)
- **Registros:** 3,641
- **Descripción:** Datos completos del SINAP incluyendo animales muertos
- **Columnas (22):**
  1. DIIO
  2. Sexo
  3. Clase
  4. Raza
  5. Edad
  6. Fecha_Nacimiento
  7. Estado
  8. Rup_Actual
  9. Nombre_Titular_Ubicacion_Actual
  10. Nombre_Predio_Ubicacion_Actual
  11. Cantidad_Titulares
  12. RUP_ultimo_movimiento
  13. Uso_Anabolicos
  14. Trazabilidad_Nacimiento
  15. Trazabilidad_Completa
  16. Rup_Origen
  17. PABCO
  18. Uso_Medicamento_No_Permitido
  19. Estado_RUP_Actual
  20. Exportable_CHINA
  21. Exportable_UE
  22. (columna vacía)

### Hoja 9: `manejos_25`
- **Registros:** 1,224
- **Descripción:** Manejos sanitarios del año 2025
- **Columnas:**
  - DIIO
  - FECHA
  - RUP
  - Descripción (tratamientos aplicados)

---

## Estadísticas Clave

### Por Estado (SINAP)
| Estado | Cantidad |
|--------|----------|
| Vivo | 2,865 |
| Muerto | 703 |
| no existe | 73 |
| **Total** | **3,641** |

### Por Sexo
| Sexo | Cantidad |
|------|----------|
| Hembra (H) | 2,189 |
| Macho (M) | 1,379 |
| no existe | 73 |

### Por Clase/Categoría
| Clase | Cantidad |
|-------|----------|
| VACA | 1,290 |
| NOVILLO | 682 |
| VAQUILLA | 644 |
| TORO | 395 |
| TERNERO | 270 |
| TERNERA | 255 |
| BUEY | 31 |
| TORITO | 1 |
| no existe | 73 |

### Por Raza
| Raza | Cantidad |
|------|----------|
| ANGUS NEGRO | 2,800 |
| ANGUS ROJO | 501 |
| HEREFORD | 138 |
| OVERO COLORADO (CLAVEL ALEMAN) | 71 |
| LIMOUSIN | 26 |
| OVERO NEGRO | 19 |
| POLLED HEREFORD | 8 |
| HIBRIDO | 3 |
| CLAVEL CHILENO | 1 |
| SHORTON | 1 |
| no existe | 73 |

### Por Establecimiento (RUP) - Top 7
| RUP | Nombre | Animales |
|-----|--------|----------|
| 11.1.01.1241 | STA MARIA 2 | 780 |
| 11.2.01.0038 | ANITA | 338 |
| 11.1.01.0791 | ANITA | 265 |
| 11.1.01.0941 | SIERRA COLORADA | 157 |
| 11.1.01.0893 | SAN CARLOS | 148 |
| 11.1.01.2304 | SAN ELIAS | 34 |
| 11.1.01.1240 | DOS TORDILLOS | 5 |

---

## Animales de Maria Auad

Filtrando por `Nombre_Titular_Ubicacion_Actual LIKE '%MARIA%'` y `Estado = 'Vivo'`:

- **Total animales vivos:** ~1,730
- **Distribuidos en 7 establecimientos principales**

---

## Notas Importantes

1. **DIIOs duplicados:** Existen 150 cambios de DIIO registrados
2. **Chips de toros:** 70 toros tienen chip RFID adicional
3. **Manejos 2025:** 1,224 registros de tratamientos sanitarios
4. **Datos SINAP vs Inventario:** SINAP tiene más registros (incluye muertos)
5. **Fechas de manejos:** Columnas separadas por año (2020-2025)

---

## Recomendaciones de Importación

1. **Fuente principal:** Usar hoja `sinap` para datos completos
2. **Filtrar:** Solo animales vivos de Maria Auad
3. **Chips:** Complementar con hoja `chip_toros`
4. **Manejos:** Importar desde `manejos_25`
5. **Cambios DIIO:** Registrar historial desde `cambio_diio`
