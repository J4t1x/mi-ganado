# Solución de Errores de Despliegue

Este documento detalla los errores encontrados en el despliegue y sus soluciones.

## Errores Corregidos

### 1. Error 404: Ruta `/registro` no encontrada

**Problema**: La carpeta `src/app/(auth)/registro` estaba vacía, causando un error 404.

**Solución**: Se creó el archivo `src/app/(auth)/registro/page.tsx` con el componente de registro completo.

**Características**:
- Formulario de registro con validación
- Integración con el backend API
- Manejo de errores mejorado
- Redirección automática al login después del registro

### 2. Error 404: Ruta `/configuracion` no encontrada

**Problema**: La ruta `/dashboard/configuracion` no tenía un archivo `page.tsx` principal.

**Solución**: Se creó el archivo `src/app/dashboard/configuracion/page.tsx` con un dashboard de configuración.

**Características**:
- Vista de tarjetas para acceder a diferentes secciones
- Enlaces a Titulares y Establecimientos
- Diseño responsive y moderno

### 3. Errores de CORS: "Access control checks"

**Problema**: El frontend intentaba hacer peticiones al backend pero fallaban por CORS.

**Análisis**:
- El backend YA tiene CORS configurado correctamente en `backend-agente/src/main.ts`
- Configuración actual:
  ```typescript
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });
  ```

**Solución en el Frontend**: Se mejoró el cliente API para:
- Incluir `mode: 'cors'` en todas las peticiones
- Incluir `credentials: 'include'` para cookies
- Mejor manejo de errores de conexión

### 4. Errores de Conexión: "Not allowed to request resource"

**Problema**: El frontend no podía conectarse al backend.

**Solución**: Se mejoró el manejo de errores en `src/lib/api/client.ts`:
- Detección de errores de conexión
- Mensajes de error más descriptivos
- Logging mejorado en consola

## Configuración Requerida

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8089
NEXT_PUBLIC_API_KEY=
```

### Verificar Backend

Asegúrate de que el backend esté ejecutándose:

```bash
cd backend-agente
npm run start:dev
```

El backend debe estar disponible en `http://localhost:8089`

## Pasos para Desplegar

### 1. Configurar Variables de Entorno

```bash
# En mi-ganado/
cp ENV-CONFIG.md .env.local
# Edita .env.local con tus valores
```

### 2. Iniciar Backend

```bash
cd backend-agente
npm run start:dev
```

Verifica que veas:
```
✅ NestJS app inicializada correctamente
🚀 Servidor ejecutándose en http://localhost:8089
🔒 Seguridad: Helmet ✓ | CORS ✓ | Validation ✓
```

### 3. Iniciar Frontend

```bash
cd mi-ganado
npm run dev
```

### 4. Verificar Funcionamiento

1. Abre `http://localhost:3000`
2. Intenta acceder a `/login`
3. Intenta acceder a `/registro`
4. Verifica que no haya errores de CORS en la consola

## Problemas Comunes y Soluciones

### "No se puede conectar con el servidor"

**Causa**: El backend no está ejecutándose o la URL es incorrecta.

**Solución**:
1. Verifica que el backend esté ejecutándose: `curl http://localhost:8089/health`
2. Verifica la variable `NEXT_PUBLIC_API_URL` en `.env.local`
3. Reinicia el servidor de desarrollo del frontend

### "Access control checks" persiste

**Causa**: Posible problema con el puerto o configuración del backend.

**Solución**:
1. Verifica que el backend esté en el puerto 8089
2. Limpia la caché del navegador
3. Verifica que no haya proxies o VPNs bloqueando las peticiones

### Base de datos sin datos

**Causa**: Las tablas existen pero no hay datos de prueba.

**Solución**:
1. Verifica las migraciones del backend
2. Ejecuta los seeders si existen:
   ```bash
   cd backend-agente
   npm run seed
   ```
3. O crea datos manualmente a través de la API

## Archivos Modificados

### Nuevos Archivos
- `src/app/(auth)/registro/page.tsx` - Página de registro
- `src/app/dashboard/configuracion/page.tsx` - Dashboard de configuración
- `ENV-CONFIG.md` - Documentación de variables de entorno
- `SOLUCION-ERRORES-DESPLIEGUE.md` - Este archivo

### Archivos Modificados
- `src/lib/api/client.ts` - Mejorado manejo de errores y CORS

## Próximos Pasos

1. **Poblar la Base de Datos**: Crear datos de prueba o seeders
2. **Testing**: Probar todas las rutas y funcionalidades
3. **Monitoreo**: Configurar logging y monitoreo de errores
4. **Optimización**: Revisar performance y optimizar queries

## Contacto y Soporte

Si encuentras más errores:
1. Revisa los logs del backend
2. Revisa la consola del navegador
3. Verifica las variables de entorno
4. Consulta la documentación del backend en `/api` (Swagger)
