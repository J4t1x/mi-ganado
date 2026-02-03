# Configuración de Variables de Entorno

Este documento describe cómo configurar las variables de entorno para el proyecto Mi Ganado.

## Variables Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:8089

# API Key (opcional, si el backend lo requiere)
NEXT_PUBLIC_API_KEY=tu_api_key_aqui
```

## Descripción de Variables

### NEXT_PUBLIC_API_URL
- **Descripción**: URL base del backend API
- **Valor por defecto**: `http://localhost:8089`
- **Producción**: Debe apuntar a la URL del backend en producción
- **Ejemplo**: `https://api.miganado.com`

### NEXT_PUBLIC_API_KEY
- **Descripción**: API Key para autenticación con el backend
- **Valor por defecto**: Vacío
- **Requerido**: Solo si el backend tiene configurada la autenticación por API Key
- **Ejemplo**: `sk_live_abc123xyz789`

## Configuración para Desarrollo

1. Copia el contenido de ejemplo arriba
2. Crea el archivo `.env.local` en la raíz del proyecto
3. Ajusta los valores según tu configuración local
4. Reinicia el servidor de desarrollo: `npm run dev`

## Configuración para Producción

Para despliegue en producción (Vercel, Netlify, etc.):

1. Configura las variables de entorno en el panel de tu proveedor
2. Asegúrate de usar HTTPS para la URL del backend
3. Verifica que el backend tenga CORS configurado correctamente

## Verificación

Para verificar que las variables están configuradas correctamente:

```bash
# En desarrollo
npm run dev

# Verifica en la consola del navegador
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## Problemas Comunes

### Error: "No se puede conectar con el servidor"
- Verifica que el backend esté ejecutándose
- Verifica que la URL en `NEXT_PUBLIC_API_URL` sea correcta
- Verifica que no haya problemas de CORS

### Error: "Access control checks"
- El backend debe tener CORS configurado para aceptar peticiones desde el frontend
- Verifica la configuración CORS en el backend

## Configuración CORS del Backend

El backend debe tener configurado CORS para aceptar peticiones desde:
- `http://localhost:3000` (desarrollo)
- Tu dominio de producción

Ejemplo de configuración en NestJS:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://tu-dominio.com'
  ],
  credentials: true,
});
```
