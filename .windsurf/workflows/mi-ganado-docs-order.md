---
description: Ordenar y mantener la carpeta docs/ alineada con las reglas del proyecto
---

Workflow para ejecutar cuando la documentación empiece a desordenarse o se agreguen muchos archivos nuevos. Mantiene la coherencia entre `docs/`, `.windsurf/rules/mi-ganado.md` y el código vigente.

## 1. Preparación

1. Leer `.windsurf/rules/mi-ganado.md` para recordar la estructura oficial de docs/ y la Regla de Auto-Mantenimiento.
2. Revisar `docs/README.md` para entender el índice actual y detectar huecos o duplicados.
3. Definir el objetivo de la sesión (p.ej. "mover documentos comerciales viejos a archive/").

## 2. Inventario rápido de docs/

// turbo
1. Listar carpetas de primer nivel: `ls docs`
2. Para cada carpeta relevante (archive, commercial, config, implementation, specs, troubleshooting) listar sus archivos: `ls docs/<carpeta>`
3. Registrar archivos huérfanos (en raíz o subcarpetas no oficiales) y documentos sin fecha de actualización visible.

## 3. Clasificar y limpiar

1. Para cada archivo huérfano decidir su destino según las reglas:
   - Documentos vivos → raíz o subcarpeta oficial.
   - Borradores o históricos → `docs/archive/`.
   - Material comercial → `docs/commercial/`.
2. Renombrar archivos para seguir el patrón `NOMBRE-DESCRIPTIVO.md` en MAYÚSCULAS y con guiones.
3. Actualizar la primera sección de cada documento con una fecha `**Actualizado:** YYYY-MM-DD`.
4. Si un documento quedó obsoleto, moverlo a `archive/` y anotar el motivo en la cabecera.

## 4. Normalizar contenido

1. Verificar que los encabezados sigan el mismo idioma (español) y formato Markdown (títulos con `#`).
2. Confirmar que los enlaces relativos funcionen después de mover archivos.
3. Para documentos largos (>500 líneas), agregar una tabla de contenidos simple si no existe.
4. Añadir notas de contexto cuando un documento dependa de otro (p.ej. specs ↔ implementation).

## 5. Actualizar índices y referencias

1. Editar `docs/README.md` para incluir nuevos archivos, rutas o subcarpetas movidas.
2. Actualizar la columna "Actualizado" del índice con la fecha real.
3. Revisar `docs/STATUS.md`, `docs/CONVENTIONS.md` y `docs/ARCHITECTURE.md` por si requieren reflejar cambios.
4. Si se agregaron o modificaron workflows o reglas, aplicar la Regla de Auto-Mantenimiento y documentarlo.

## 6. Checklist final

1. Ejecutar `git status` y revisar solo cambios esperados (nuevos archivos, movimientos, timestamps).
2. Abrir los documentos clave en el navegador Markdown o preview para validar enlaces.
3. Anotar en el commit/resumen qué se reorganizó y por qué.
4. Compartir el resultado con el equipo (issue, PR o changelog) para mantener visibilidad.
