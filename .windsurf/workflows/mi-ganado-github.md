---
description: Subida de cambios de mi-ganado a GitHub con Conventional Commits
---

Workflow para hacer commit y push del proyecto mi-ganado siguiendo las convenciones de commits del equipo.

## 1. Pre-checks

// turbo
1. Verificar estado del repo: `git status`
2. Revisar que no haya conflictos pendientes: `git diff --check`
3. Confirmar rama actual: `git branch --show-current`

## 2. Elegir tipo de commit

Usar **Conventional Commits** según el tipo de cambio realizado:

| Tipo | Cuándo usar |
|------|-------------|
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de un bug |
| `docs` | Cambios solo en documentación |
| `style` | Formato sin cambio de lógica (linting, espacios) |
| `refactor` | Reestructura sin cambiar comportamiento externo |
| `perf` | Mejora de rendimiento |
| `test` | Agrega o corrige pruebas |
| `build` | Cambios en build o dependencias (package.json, tsconfig) |
| `ci` | Cambios en CI/CD (GitHub Actions, pipelines) |
| `chore` | Mantenimiento que no toca src ni tests |
| `revert` | Revierte un commit previo |
| `hotfix` | Corrección urgente en producción |
| `wip` | Trabajo en progreso (solo en ramas, nunca en main) |

**Formato:** `tipo(scope): descripción corta en minúsculas`

Ejemplos:
- `feat(pesajes): agrega vista detalle de sesión de pesaje`
- `fix(api): corrige 429 en listado de animales`
- `docs: actualiza STATUS.md con módulo pesajes`
- `refactor(auth): extrae lógica de token a helper`

## 3. Preparar y hacer commit

1. Agregar archivos al staging:
   - Todo: `git add .`
   - Selectivo: `git add src/app/dashboard/pesajes/` (preferido para commits atómicos)
2. Revisar lo que se va a commitear: `git diff --staged --stat`
3. Hacer commit: `git commit -m "tipo(scope): descripción"`
4. Si el cambio toca múltiples áreas, hacer commits separados por tipo.

## 4. Push a GitHub

1. Push a la rama actual: `git push origin $(git branch --show-current)`
2. Si es la primera vez en esta rama: `git push -u origin $(git branch --show-current)`
3. Verificar en GitHub que el push llegó correctamente.

## 5. Post-push

1. Si el cambio modifica arquitectura o stack → actualizar `docs/ARCHITECTURE.md` y `.windsurf/rules/mi-ganado.md`
2. Si se completó un módulo → actualizar `docs/STATUS.md` y `docs/implementation/`
3. Si se resolvió un bug → documentar en `docs/troubleshooting/`
4. Si se cambiaron convenciones → actualizar `docs/CONVENTIONS.md`

## 6. Errores comunes

- **Push rechazado (non-fast-forward):** hacer `git pull --rebase origin main` antes de push.
- **Archivos sensibles (.env, tokens):** verificar `.gitignore` antes de `git add .`
- **Commit muy grande:** dividir en commits atómicos por tipo/scope.
