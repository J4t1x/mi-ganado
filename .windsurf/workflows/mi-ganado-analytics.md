---
description: Obtener analítica, métricas de rendimiento y logs de producción de mi-ganado
---

Workflow para monitorear mi-ganado en producción usando Vercel Analytics, Speed Insights y Logs.

## 1. Ver Logs en tiempo real

// turbo
1. Verificar proyecto vinculado: `cat .vercel/project.json`
2. Iniciar streaming de logs: `vercel logs miganado.vercel.app`
3. Mientras el comando corre, abrir la app en el navegador y navegar
4. Los logs aparecen en la terminal en tiempo real
5. Detener con `Ctrl+C`

> **Nota:** `vercel logs` es streaming — solo muestra logs mientras está activo. Para logs históricos usar el dashboard web.

## 2. Revisar Analítica (Dashboard web)

Abrir en el navegador:

1. **Analytics (tráfico):** https://vercel.com/ja-viers-projects/mi-ganado/analytics
   - Page views, visitantes únicos, top pages, referrers, países
   - Componente `<Analytics />` en `src/app/layout.tsx`
   - Paquete: `@vercel/analytics`

2. **Speed Insights (rendimiento):** https://vercel.com/ja-viers-projects/mi-ganado/speed-insights
   - Core Web Vitals reales: LCP, CLS, INP, TTFB, FCP
   - Componente `<SpeedInsights />` en `src/app/layout.tsx`
   - Paquete: `@vercel/speed-insights`

3. **Logs (errores y requests):** https://vercel.com/ja-viers-projects/mi-ganado/logs
   - Filtrar por nivel: error, warn, info
   - Filtrar por ruta, status code, rango de tiempo
   - Buscar tags de error boundaries: `[GlobalError]`, `[AppError]`, `[DashboardError]`

## 3. Verificar Error Boundaries

Los error boundaries loguean errores con tags específicos visibles en Vercel Logs:

| Archivo | Tag | Alcance |
|---------|-----|---------|
| `src/app/global-error.tsx` | `[GlobalError]` | Errores que rompen el layout raíz |
| `src/app/error.tsx` | `[AppError]` | Errores en páginas generales |
| `src/app/dashboard/error.tsx` | `[DashboardError]` | Errores en módulos del dashboard |

### Probar error boundary manualmente
1. Abrir la app en producción
2. Abrir DevTools → Console
3. Provocar un error (ej: desconectar backend, visitar ruta con datos corruptos)
4. Verificar que aparece la UI de error con botón "Reintentar"
5. Ir a Vercel Logs y buscar el tag correspondiente
6. Confirmar que el log incluye: `message`, `digest`, `timestamp`, `url`

## 4. Checklist de salud post-deploy

Ejecutar después de cada deploy significativo:

// turbo
1. Verificar deploy activo: `vercel inspect miganado.vercel.app`

### Verificación manual
2. Abrir https://miganado.vercel.app/login — debe cargar sin errores
3. Login → Dashboard — verificar que carga datos reales
4. Navegar: Animales → Lotes → Movimientos → Pesajes → Configuración
5. Abrir DevTools → Console — no debe haber errores rojos
6. Abrir DevTools → Network — verificar que las llamadas API responden 200

### Métricas objetivo

| Métrica | Umbral bueno | Umbral aceptable |
|---------|-------------|-------------------|
| LCP | < 2.5s | < 4.0s |
| CLS | < 0.1 | < 0.25 |
| INP | < 200ms | < 500ms |
| TTFB | < 800ms | < 1.8s |
| FCP | < 1.8s | < 3.0s |

## 5. Diagnóstico de errores en producción

### Flujo recomendado
1. Usuario reporta error → anotar URL, hora aproximada, acción que realizaba
2. Ir a Vercel Logs → filtrar por timestamp y ruta
3. Buscar tags `[DashboardError]`, `[AppError]` o `[GlobalError]`
4. Revisar el `digest` del error para correlacionar con el código
5. Si hay degradación de rendimiento → revisar Speed Insights
6. Si afecta a múltiples usuarios → revisar Analytics (caída de page views)
7. Si es crítico → rollback inmediato (ver workflow `/mi-ganado-vercel` sección 5)

### Errores comunes

| Síntoma | Causa probable | Acción |
|---------|---------------|--------|
| Página en blanco | Error en layout/global-error | Revisar Vercel Logs por `[GlobalError]` |
| "Algo salió mal" | Error boundary de app/dashboard | Buscar `[AppError]` o `[DashboardError]` en Logs |
| Datos no cargan | Backend caído o CORS | Verificar `NEXT_PUBLIC_API_URL` y estado de Railway |
| Lentitud general | Regresión de rendimiento | Comparar Speed Insights entre deploys |
| 404 en rutas | Build incompleto | Verificar que la ruta existe en output de `npm run build` |

## 6. Actualizar informe de analítica

Después de recopilar datos, actualizar `docs/ANALITICA-VERCEL.md`:

1. Llenar tabla de Core Web Vitals (sección 3.1) con datos de Speed Insights
2. Llenar tabla de tráfico (sección 3.2) con datos de Analytics
3. Registrar errores detectados en tabla 3.3
4. Marcar checks completados en la checklist (sección 2)
5. Commit: `git add docs/ANALITICA-VERCEL.md && git commit -m "docs: actualizar métricas analítica"`
