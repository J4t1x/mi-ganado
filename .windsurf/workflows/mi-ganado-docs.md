---
description: Auditar y actualizar la documentación del proyecto mi-ganado
---

Workflow para verificar que la documentación refleje el estado real del código. Ejecutar periódicamente o al final de un sprint.

## 1. Auditar estado de módulos

// turbo
1. Listar las carpetas en `src/app/dashboard/` para identificar módulos existentes
2. Listar los archivos en `src/lib/api/` para identificar services implementados
3. Listar los archivos en `src/components/` para identificar componentes por módulo

## 2. Actualizar STATUS.md

1. Leer `docs/STATUS.md`
2. Comparar con los módulos reales encontrados en el paso 1
3. Actualizar el estado de cada módulo (✅ completado, 🔧 en desarrollo, 📋 planificado)
4. Actualizar la sección de "Bugs Activos" si hay issues conocidos
5. Actualizar "Próximo Sprint" según prioridades actuales

## 3. Verificar ARCHITECTURE.md

1. Leer `docs/ARCHITECTURE.md`
2. Comparar el stack listado con `package.json`
3. Verificar que el diagrama de entidades refleje los types en `src/types/index.ts`
4. Actualizar si hay discrepancias

## 4. Verificar implementación documentada

1. Leer cada archivo en `docs/implementation/`
2. Verificar que los archivos referenciados existan en `src/`
3. Marcar documentos desactualizados o crear nuevos si hay módulos sin documentar

## 5. Actualizar reglas de Cascade

1. Leer `.windsurf/rules/mi-ganado.md`
2. Verificar que la estructura de `src/` listada sea correcta
3. Verificar que las convenciones reflejen los patrones actuales del código
4. Actualizar si hay cambios

## 6. Actualizar índice

1. Leer `docs/README.md`
2. Verificar que todos los documentos en `docs/` estén listados en el índice
3. Actualizar timestamps de última modificación
4. Agregar documentos nuevos que falten en el índice
