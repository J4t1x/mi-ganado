# Implementación de Deploy en Vercel - Mi Ganado

## 1. Resumen ejecutivo
El frontend de Mi Ganado (Next.js 16 + React 19) se despliega en Vercel para aprovechar previews automáticos, CDN global y la integración directa con GitHub, mientras que el backend (`backend-agente`) y la base de datos residen en Railway. Este documento explica cómo reproducir, mantener y depurar el despliegue en Vercel.

## 2. Topología del despliegue
```
[GitHub repo mi-ganado] --push--> [Vercel Builds] --deploy--> [Vercel Edge/CDN]
                                                   |
                                                   └── env vars -> NEXT_PUBLIC_API_URL (Railway backend)

[Usuarios] -> https://mi-ganado.vercel.app  -> Next.js App Router
                                                │
                                                └-> llamadas API -> https://backend-agente.railway.app/api/v1/ganado
```
- Frontend: Vercel (región automática). Referencia arquitectónica en `docs/ARCHITECTURE.md` @mi-ganado/docs/ARCHITECTURE.md#26-59.
- Backend + DB: Railway (NestJS + Prisma + PostgreSQL).
- CDN/Cache: administrado por Vercel, incluye soporte para ISR/Edge si se habilita.

## 3. Requisitos previos
1. **Herramientas**: Node 20+, npm 10+, Vercel CLI (`npm i -g vercel`).
2. **Accesos**: permisos al proyecto Vercel (Owner/Developer) y al repositorio GitHub.
3. **Archivos locales**: `.env.local` configurado (ver `docs/config/ENV-CONFIG.md`).
4. **Conexión backend**: URL pública del backend en Railway accesible desde Vercel (HTTPS + CORS habilitado).

## 4. Preparación local
1. Instalar dependencias: `npm install`.
2. Validar build antes de subir: `npm run lint && npm run build`.
3. Verificar que `.vercel/project.json` exista (lo genera `vercel link`). Si no existe:
   ```bash
   vercel link  # Seleccionar la organización/proyecto mi-ganado
   ```
4. Autenticarse en CLI si es necesario: `vercel login`.

## 5. Procedimiento de despliegue
### 5.1 Pipeline automático (principal)
1. Trabajar en rama feature y abrir Pull Request.
2. Vercel crea **Preview Deployments** por PR; compartir URL para QA.
3. Al hacer merge a `main`, se dispara deploy **Production**.
4. Confirmar en dashboard o CLI:
   ```bash
   vercel ls mi-ganado
   ```

### 5.2 Deploy manual desde CLI
Usar cuando se requiere hotfix sin esperar pipeline.
```bash
npm run build
vercel --prod
```
- El comando toma variables del entorno “Production” configurado en Vercel.
- Registrar la URL resultante y verificar contra la checklist (sección 9).

### 5.3 Integración con workflows de Cascade
El paso "## 5. Deploy a Vercel" en `.windsurf/workflows/mi-ganado-dev.md` cubre la secuencia de build, commit y push que gatilla el deployment @mi-ganado/.windsurf/workflows/mi-ganado-dev.md#67-74. Consulta este documento para detalles y troubleshooting extendido.

## 6. Gestión de ambientes y variables
| Ambiente | Comando CLI | Variables clave |
|----------|-------------|-----------------|
| Development | `.env.local` local | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_KEY` |
| Preview (PR) | `vercel env ls` (scope preview) | mismas que production pero apuntando a backend staging si existiera |
| Production | `vercel env pull .env.production` / `vercel env add <NAME> <value> production` | `NEXT_PUBLIC_API_URL=https://backend-agente.railway.app`, `NEXT_PUBLIC_API_KEY` |

- Mantener valores sincronizados con `docs/config/ENV-CONFIG.md` @mi-ganado/docs/config/ENV-CONFIG.md#7-74.
- Para rotar secretos ejecutar: `vercel env rm NEXT_PUBLIC_API_KEY production` y luego `vercel env add ...`.

## 7. Monitoreo y detección de errores en producción

### 7.1 Vercel Analytics (tráfico y uso)
- **Paquete**: `@vercel/analytics` — ya integrado en `src/app/layout.tsx`.
- **Dashboard**: Vercel → proyecto → pestaña **Analytics**.
- Métricas: page views, visitantes únicos, top pages, referrers, países.
- No requiere configuración adicional; se activa automáticamente en deploys de Vercel.

### 7.2 Speed Insights (rendimiento real de usuarios)
- **Paquete**: `@vercel/speed-insights` — integrado en `src/app/layout.tsx`.
- **Dashboard**: Vercel → proyecto → pestaña **Speed Insights**.
- Métricas: LCP, FID, CLS, TTFB, INP (Core Web Vitals reales, no sintéticos).
- Permite detectar regresiones de rendimiento entre deploys.

### 7.3 Error Boundaries (captura de errores React)
Tres niveles de error boundary implementados:

| Archivo | Alcance | Qué captura |
|---------|---------|-------------|
| `src/app/global-error.tsx` | Toda la app (incluye layout) | Errores críticos que rompen el layout raíz |
| `src/app/error.tsx` | Páginas fuera del dashboard | Errores en login, registro, landing |
| `src/app/dashboard/error.tsx` | Todo el dashboard | Errores en módulos CRUD, configuración |

Cada boundary:
- Loguea `console.error` con tag `[GlobalError]`, `[AppError]` o `[DashboardError]`.
- Incluye `error.message`, `error.digest`, `stack`, `timestamp` y `url`.
- Estos logs son visibles en **Vercel Logs** (ver 7.4).
- Muestra UI amigable con botón "Reintentar" y navegación al inicio.

### 7.4 Vercel Logs (logs en tiempo real)
- **Dashboard**: Vercel → proyecto → pestaña **Logs**.
- **CLI**: `vercel logs https://mi-ganado.vercel.app --since=1h`
- Filtra por: nivel (error, warn, info), función, ruta, status code.
- Los `console.error` de los error boundaries aparecen aquí automáticamente.
- Útil para diagnosticar errores de API, SSR y runtime.

### 7.5 Alertas y notificaciones
- Configurar en Vercel → Settings → **Notifications**:
  - **Deploy failed**: alerta por email o Slack cuando un build falla.
  - **Domain issues**: problemas de certificado SSL o DNS.
- Opcionalmente integrar webhook a Slack/Discord para notificaciones en tiempo real.

### 7.6 Flujo de diagnóstico recomendado
1. Usuario reporta error → revisar **Vercel Logs** filtrando por timestamp.
2. Buscar tag `[DashboardError]` o `[AppError]` + el `digest` del error.
3. Correlacionar con **Speed Insights** si hay degradación de rendimiento.
4. Revisar **Analytics** para confirmar si afecta a múltiples usuarios.
5. Si es crítico → rollback (sección 8) + hotfix en rama separada.

## 8. Rollback y contingencias
1. Identificar el deployment previo: `vercel ls --prod mi-ganado`.
2. Ejecutar rollback:
   ```bash
   vercel rollback <deployment-id>
   ```
3. Verificar que la URL pública sirva la versión anterior.
4. Registrar el incidente en `docs/logs/` y crear issue con la causa raíz.
5. Si el problema está ligado al backend, coordinar con Railway (ver documentos en `backend-agente`).

## 9. Checklist de validación post-deploy
- [ ] Login/logout funcionan (`/login`, `/dashboard`).
- [ ] Dashboard carga datos reales (ver console para errores de API).
- [ ] CRUD de Animales operativo (ver `docs/implementation/IMPLEMENTACION-ANIMALES.md`).
- [ ] Navegación entre módulos sin errores (Configuración, Lotes, Pesajes, Movimientos).
- [ ] No hay warnings en consola del navegador.
- [ ] Lighthouse o Vercel Analytics sin regresiones severas.

## 10. Mejoras y automatización futura
1. Agregar `vercel cron` para tareas programadas (ej. health checks al backend).
2. Integrar Axiom o Sentry para observabilidad avanzada.
3. Automatizar la checklist con Playwright en CI antes del deploy.
4. Documentar procesos de dominio personalizado (`miganado.cl`) cuando se habilite.
5. Evaluar Scheduled Functions para mantener sincronizada la caché offline.
