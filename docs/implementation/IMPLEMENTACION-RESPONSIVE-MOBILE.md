# Implementación — Responsive Mobile Dashboard (Sprint 8)

**Fecha:** 2026-02-09

Mejora integral de la experiencia móvil del dashboard, abarcando navegación, tablas, botones, filtros, paginación y gráficos.

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `src/components/layout/header.tsx` | Sheet lateral reemplaza dropdown inline; nav completa + Administración |
| `src/components/ui/sheet.tsx` | **Nuevo** — componente shadcn/ui Sheet |
| `src/app/dashboard/animales/page.tsx` | Botones en dropdown móvil, vista card, filtros responsivos, paginación compacta |
| `src/app/dashboard/movimientos/page.tsx` | Botones responsivos, vista card móvil |
| `src/app/dashboard/pesajes/page.tsx` | Botones responsivos, labels cortos en móvil |
| `src/app/dashboard/sanitario/page.tsx` | Botones responsivos, vista card móvil, filtros responsivos, paginación compacta |
| `src/app/dashboard/reportes/page.tsx` | Filtros de fecha responsivos (`w-full sm:w-40`), labels cortos |
| `src/app/dashboard/page.tsx` | PieChart legend bottom, BarChart labels rotados, radios ajustados |

## Patrones Implementados

### 1. Menú móvil (Sheet)
- `Sheet` de shadcn/ui con `side="left"` y `w-72`
- Navegación principal (8 items) + sección "Administración" (5 items)
- Se cierra automáticamente al cambiar de ruta (`useEffect` en `pathname`)
- Footer con info de usuario y botón cerrar sesión

### 2. Botones de acción responsivos
- **Patrón A** (animales): botones secundarios en `hidden sm:flex` + `DropdownMenu` en `sm:hidden`
- **Patrón B** (pesajes, sanitario, movimientos): `Button size="icon"` en móvil, `Button size="sm"` con texto en desktop
- Botón primario siempre visible con label corto en móvil (`<span className="sm:hidden">Nuevo</span>`)

### 3. Vista card para tablas
- Tabla desktop: `hidden md:block overflow-x-auto`
- Cards móvil: `md:hidden space-y-3` con `Link` clickeable al detalle
- Cada card muestra: dato principal + badge estado + grid 2 columnas con datos clave

### 4. Filtros responsivos
- `w-full sm:w-[140px]` en lugar de `w-[140px]` fijo
- Date inputs: `grid grid-cols-2 gap-3 sm:flex sm:gap-4`

### 5. Paginación compacta
- Texto: `<span className="sm:hidden">{count}/{total}</span>` vs texto largo en desktop
- Botones: `<` / `>` en móvil, "Anterior" / "Siguiente" en desktop

### 6. Gráficos
- BarChart: `angle={-35}` cuando hay >3 establecimientos, `margin.bottom` dinámico
- PieChart: `Legend verticalAlign="bottom"`, radios reducidos (40/65 vs 50/75)

## Breakpoints Usados

| Breakpoint | Uso |
|-----------|-----|
| `sm:` (640px) | Botones con texto, filtros en fila, paginación con texto |
| `md:` (768px) | Tabla vs cards, sidebar visible, header height |

## Dependencias Agregadas
- `shadcn/ui Sheet` (basado en Radix Dialog)
