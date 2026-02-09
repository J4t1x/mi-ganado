# Configuración de Variables de Entorno

Este documento describe cómo configurar las variables de entorno para el proyecto Mi Ganado.

## Auto-detección de ambiente

La URL del backend se resuelve automáticamente en `src/lib/api/config.ts`:

| Ambiente | NODE_ENV | Backend URL |
|---|---|---|
| **Desarrollo** (`npm run dev`) | `development` | `http://localhost:8089` |
| **Producción** (Vercel build) | `production` | `https://jard.up.railway.app` |

Si se define `API_URL` explícitamente, **siempre tiene prioridad** sobre la auto-detección.

## Variables de entorno

Las variables del backend son `API_URL` y `API_KEY` (sin prefijo `NEXT_PUBLIC_`). `next.config.ts` las expone al cliente via su bloque `env`.

### `.env` (defaults para desarrollo, commiteable si no tiene secretos)

```bash
# API Key para autenticación con el backend
API_KEY=<tu_api_key>

# URL del backend (dejar vacío para auto-detección por NODE_ENV)
# API_URL=http://localhost:8089
```

### `.env.local` (generado por `vercel env pull`, gitignored)

Contiene variables de Supabase, Vercel OIDC, etc. **No debe definir `API_URL`** para que la auto-detección funcione correctamente.

> **Nota:** Cada vez que ejecutes `vercel env pull`, revisa que no se haya agregado `API_URL` al `.env.local`. Si aparece, elimínalo.

### API_KEY
- **Descripción**: API Key para autenticación con el backend
- **Requerido**: Sí
- **Valor**: Se obtiene de `backend-agente/docs/API_KEY_MIGANADO.md`

## Configuración para Desarrollo

1. Asegúrate de que `.env` tenga el `API_KEY`
2. **No** definas `API_URL` (se auto-detecta como `http://localhost:8089`)
3. Levanta el backend local en puerto 8089
4. Ejecuta: `npm run dev`

## Configuración para Producción (Vercel)

Las variables se configuran en el panel de Vercel (`vercel env`):
- `API_KEY` → API key de producción
- `API_URL` → **No es necesario** (auto-detecta `https://jard.up.railway.app`)

Si se necesita apuntar a otro backend, definir `API_URL` explícitamente en Vercel.

## Verificación

```bash
# En desarrollo — debe mostrar http://localhost:8089
npm run dev
# Abrir consola del navegador y verificar las llamadas de red

# En producción — debe apuntar a https://jard.up.railway.app
npm run build && npm run start
```

## Problemas Comunes

### Error: "No se puede conectar con el servidor" (503 en desarrollo)
- Verifica que el backend esté ejecutándose en `http://localhost:8089`
- Si no tienes backend local, define `API_URL=https://jard.up.railway.app` en `.env`

### Error: "Access control checks"
- El backend debe tener CORS configurado para aceptar peticiones desde el frontend

## Configuración CORS del Backend

El backend debe tener configurado CORS para aceptar peticiones desde:
- `http://localhost:3000` (desarrollo)
- `https://miganado.vercel.app`, `https://miganado.cl`, `https://www.miganado.cl` (producción)

## Arquitectura de config centralizada

Toda la resolución de URL y API key está en `src/lib/api/config.ts`. Los servicios API importan `getApiConfig()` y `getToken()` desde ahí. **No duplicar** `process.env.API_URL` en otros archivos.

`next.config.ts` expone `API_URL` y `API_KEY` al cliente:
```ts
env: {
  API_URL: process.env.API_URL,
  API_KEY: process.env.API_KEY,
},
```
