# Informe de Analítica - Mi Ganado

> **Fecha del informe:** 2026-02-09
> **Ambiente:** Producción (Vercel)
> **Herramientas:** Vercel Analytics, Speed Insights, Error Boundaries

---

## 1. Estado de implementación

| Componente | Paquete | Archivo | Estado |
|------------|---------|---------|--------|
| Vercel Analytics | `@vercel/analytics` | `src/app/layout.tsx` | ✅ Activo |
| Speed Insights | `@vercel/speed-insights` | `src/app/layout.tsx` | ✅ Activo |
| Error Boundary Global | — | `src/app/global-error.tsx` | ✅ Implementado |
| Error Boundary App | — | `src/app/error.tsx` | ✅ Implementado |
| Error Boundary Dashboard | — | `src/app/dashboard/error.tsx` | ✅ Implementado |

---

## 2. Checklist de verificación post-deploy

Ejecutar después de cada deploy a producción para confirmar que el monitoreo funciona.

### 2.1 Vercel Analytics
- [ ] Abrir la app en producción y navegar por al menos 3 páginas
- [ ] Ir a Vercel Dashboard → proyecto → **Analytics**
- [ ] Verificar que aparecen page views recientes (puede tardar ~1 min)
- [ ] Confirmar métricas: top pages, visitantes, referrers

### 2.2 Speed Insights
- [ ] Navegar por `/dashboard`, `/dashboard/animales`, `/dashboard/movimientos`
- [ ] Ir a Vercel Dashboard → proyecto → **Speed Insights**
- [ ] Verificar que aparecen métricas de Core Web Vitals
- [ ] Revisar: LCP < 2.5s, CLS < 0.1, INP < 200ms

### 2.3 Error Boundaries
- [ ] Abrir DevTools → Console en producción
- [ ] Provocar un error (ej: desconectar backend o visitar ruta con datos corruptos)
- [ ] Verificar que aparece la UI de error con botón "Reintentar"
- [ ] Ir a Vercel Dashboard → **Logs** y buscar tag `[DashboardError]` o `[AppError]`
- [ ] Confirmar que el log incluye: message, digest, timestamp

### 2.4 Logs de Vercel
- [ ] Ir a Vercel Dashboard → proyecto → **Logs**
- [ ] Filtrar por nivel "Error" en la última hora
- [ ] Verificar que los `console.error` de los boundaries aparecen
- [ ] Opcionalmente probar CLI: `vercel logs <url> --since=1h`

---

## 3. Métricas base (llenar después del primer deploy)

### 3.1 Core Web Vitals

| Métrica | Valor | Umbral bueno | Estado |
|---------|-------|--------------|--------|
| LCP (Largest Contentful Paint) | _pendiente_ | < 2.5s | ⏳ |
| CLS (Cumulative Layout Shift) | _pendiente_ | < 0.1 | ⏳ |
| INP (Interaction to Next Paint) | _pendiente_ | < 200ms | ⏳ |
| TTFB (Time to First Byte) | _pendiente_ | < 800ms | ⏳ |
| FCP (First Contentful Paint) | _pendiente_ | < 1.8s | ⏳ |

### 3.2 Tráfico (primera semana)

| Métrica | Valor |
|---------|-------|
| Page views totales | _pendiente_ |
| Visitantes únicos | _pendiente_ |
| Top 3 páginas | _pendiente_ |
| Tasa de rebote | _pendiente_ |
| Dispositivos (desktop/mobile) | _pendiente_ |

### 3.3 Errores detectados

| Fecha | Tag | Mensaje | Digest | Página | Resuelto |
|-------|-----|---------|--------|--------|----------|
| — | — | — | — | — | — |

---

## 4. Páginas críticas a monitorear

| Página | Ruta | Prioridad | Notas |
|--------|------|-----------|-------|
| Login | `/login` | Alta | Punto de entrada, debe cargar rápido |
| Dashboard | `/dashboard` | Alta | Carga stats + últimos movimientos |
| Animales | `/dashboard/animales` | Alta | Tabla paginada, llamada API pesada |
| Detalle Animal | `/dashboard/animales/[id]` | Media | Carga historial completo |
| Movimientos | `/dashboard/movimientos` | Alta | Formulario con selector de animales |
| Pesajes | `/dashboard/pesajes` | Media | Sesiones con datos de balanza |
| Lotes | `/dashboard/lotes` | Media | CRUD con relación a animales |
| Configuración | `/dashboard/configuracion` | Baja | Páginas estáticas |

---

## 5. Cómo actualizar este informe

1. Después de cada deploy significativo, llenar la sección 3 con datos del dashboard de Vercel.
2. Registrar errores detectados en la tabla 3.3.
3. Comparar Core Web Vitals entre deploys para detectar regresiones.
4. Archivar informes anteriores en `docs/archive/` si se acumulan.

### Comandos útiles

```bash
# Ver deployments recientes
vercel ls mi-ganado

# Logs de la última hora
vercel logs https://mi-ganado.vercel.app --since=1h

# Logs filtrados por errores
vercel logs https://mi-ganado.vercel.app --since=1h --level=error
```

---

## 6. Próximos pasos

- [ ] Completar métricas base después del primer deploy con monitoreo activo
- [ ] Configurar alertas en Vercel → Settings → Notifications (deploy failed)
- [ ] Evaluar integración con Sentry o Axiom para trazabilidad avanzada
- [ ] Automatizar reporte con Playwright + Lighthouse CI en el futuro
