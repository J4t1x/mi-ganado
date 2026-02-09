---
description: Desarrollo del frontend mi-ganado (setup, dev, módulos CRUD, deploy)
---

Workflow para gestionar el desarrollo del frontend Next.js de Mi Ganado.

## 1. Setup Inicial

// turbo
1. Instalar dependencias: `npm install`
2. Copiar archivo de entorno: `cp .env.example .env.local`
3. Configurar variables en `.env.local`:
   - `NEXT_PUBLIC_API_URL` — URL del backend (default: `http://localhost:8089`)
   - `NEXT_PUBLIC_API_KEY` — API key del backend
4. Iniciar servidor de desarrollo: `npm run dev`
5. Verificar en http://localhost:3000

## 2. Desarrollo Local

// turbo
1. Iniciar dev server: `npm run dev`
2. Verificar que el backend esté corriendo en la URL configurada
3. Acceder al dashboard en http://localhost:3000/dashboard
4. Verificar conexión con backend en la consola del navegador

## 3. Agregar Nuevo Módulo CRUD

### 3.1 Crear API Service
1. Crear `src/lib/api/{modulo}.ts` siguiendo el patrón de `animales.ts`
2. Importar `apiClient` desde `./client`
3. Implementar métodos: `getAll`, `getById`, `create`, `update`, `delete`
4. Exportar el service como `{modulo}Service`

### 3.2 Crear Types
1. Agregar interfaces en `src/types/index.ts`
2. Incluir: entity type, create DTO, update DTO, list response

### 3.3 Crear Componentes
1. Crear carpeta `src/components/{modulo}/`
2. Crear componentes siguiendo el patrón existente:
   - `{modulo}-form.tsx` — Formulario con React Hook Form + Zod
   - `{modulo}-list.tsx` — Listado con tabla/cards
   - `{modulo}-detail.tsx` — Vista detallada (si aplica)

### 3.4 Crear Páginas
1. Crear carpeta `src/app/dashboard/{modulo}/`
2. Crear `page.tsx` — Página principal (listado)
3. Crear `nuevo/page.tsx` — Página de creación
4. Crear `[id]/page.tsx` — Página de detalle/edición

### 3.5 Integrar en Navegación
1. Agregar link en `src/components/layout/sidebar.tsx`
2. Agregar ruta en el menú de navegación

### 3.6 Documentar
1. Crear `docs/implementation/IMPLEMENTACION-{MODULO}.md`
2. Actualizar `docs/STATUS.md` con el nuevo módulo
3. Actualizar `.windsurf/rules/mi-ganado.md` si cambió la estructura

## 4. Testing y Calidad

// turbo
1. Ejecutar linting: `npm run lint`
2. Verificar build: `npm run build`
3. Revisar errores de TypeScript en la consola

## 5. Deploy a Vercel

1. Verificar que el build pase localmente: `npm run build`
2. Commit cambios: `git add . && git commit -m "feat: descripción"`
3. Push a rama: `git push origin main`
4. Vercel desplegará automáticamente
5. Verificar deployment en la URL de Vercel

## 6. Troubleshooting Común

### Error de CORS
- Verificar que el backend tenga CORS configurado para el dominio del frontend
- Revisar `NEXT_PUBLIC_API_URL` en `.env.local`

### Error 429 (Throttling)
- El backend tiene rate limiting — usar el cache de `src/lib/api/cache.ts`
- No hacer múltiples llamadas simultáneas al mismo endpoint
- Ver `docs/troubleshooting/SOLUCION-THROTTLING.md`

### Componentes UI no encontrados
- Instalar con: `npx shadcn@latest add {componente}`
- Los componentes se instalan en `src/components/ui/`
