---
description: Flujo de auth y sesión en mi-ganado
---

Workflow para probar, depurar y mantener la autenticación (login/logout, token, AuthGuard).

## 1. Comprobaciones previas
// turbo
1. Verificar backend y URL: `curl $NEXT_PUBLIC_API_URL/health` (espera 200).
2. Probar endpoint de perfil: `curl -H "Authorization: Bearer $TOKEN" $NEXT_PUBLIC_API_URL/auth/profile`.
3. Revisar `.env.local`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_KEY` (si aplica).

## 2. Login
// turbo
1. Ingresar credenciales en `/login`.
2. Confirmar en consola: `localStorage.getItem('access_token')` existe.
3. Navegar a `/dashboard` y verificar que no redirija al login.

## 3. AuthGuard y sesión
1. Desde consola, ejecutar `await authClient.getProfile()`; debe devolver usuario.
2. Forzar expiración: `localStorage.removeItem('access_token')` y refrescar; debe mandar a `/login`.
3. Probar navegación de rutas protegidas (dashboard y subrutas) tras relogin.

## 4. Logout
1. Click en logout (o `authClient.logout()`), confirmar que `access_token` se borra.
2. Refrescar; debe ir a `/login`.

## 5. Errores comunes y fixes rápidos
- 401/403:
  - Confirmar token en localStorage.
  - Revisar `Authorization` y `X-API-Key` en `src/lib/api/client.ts`.
  - Si sigue: limpiar storage y relogin.
- CORS: validar dominio permitido en backend y `NEXT_PUBLIC_API_URL` correcto.
- Loop al login: verifica que `AuthGuard` no esté retornando null por falta de token.

## 6. Checklist rápida antes de subir cambios de auth
// turbo
1. `npm run lint`
2. `npm run build`
3. Smoke manual: login → dashboard → acción CRUD rápida → logout
