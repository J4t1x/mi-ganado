# Convenciones de Desarrollo — Mi Ganado

**Última actualización:** 2026-02-11

## Estructura de un Módulo CRUD

Cada módulo sigue este patrón:

```
src/
├── lib/api/{modulo}.ts              # Service: getAll, getById, create, update, delete
├── types/index.ts                   # Interfaces: Entity, CreateDto, UpdateDto
├── components/{modulo}/             # Componentes específicos del módulo
│   ├── {modulo}-form.tsx            # Formulario (React Hook Form + Zod)
│   ├── {modulo}-list.tsx            # Listado (tabla o cards)
│   └── {modulo}-detail.tsx          # Vista detallada (opcional)
└── app/dashboard/{modulo}/          # Páginas
    ├── page.tsx                     # Listado principal
    ├── nuevo/page.tsx               # Creación
    └── [id]/page.tsx                # Detalle/edición
```

## API Services

- Todos los services importan `apiClient` desde `@/lib/api/client`
- Nunca hacer `fetch()` directo — siempre usar `apiClient.get/post/patch/delete`
- Endpoints bajo `/api/v1/ganado/{recurso}`
- Respuestas paginadas usan `PaginatedResponse<T>`

```typescript
// Patrón estándar de un service
import { apiClient } from './client';
import { Entity, CreateEntityDto, PaginatedResponse } from '@/types';

export const entityService = {
  async getAll(params?: Record<string, string>): Promise<PaginatedResponse<Entity>> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/entities${query}`);
  },
  async getById(id: string): Promise<Entity> {
    return apiClient.get(`/entities/${id}`);
  },
  async create(data: CreateEntityDto): Promise<Entity> {
    return apiClient.post('/entities', data);
  },
  async update(id: string, data: Partial<CreateEntityDto>): Promise<Entity> {
    return apiClient.patch(`/entities/${id}`, data);
  },
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/entities/${id}`);
  },
};
```

## Formularios

- Usar **React Hook Form** con **Zod** para validación
- Resolver: `@hookform/resolvers/zod`
- Schemas Zod definidos en el mismo archivo del formulario o en un archivo `schemas.ts`
- Labels y mensajes de error en español

```typescript
// Patrón de formulario
const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  // ...
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { nombre: '' },
});
```

## Componentes UI

- Usar **shadcn/ui** para todos los componentes base (Button, Input, Dialog, Table, etc.)
- Instalar nuevos componentes: `npx shadcn@latest add {componente}`
- Los componentes se copian a `src/components/ui/`
- Iconos: **Lucide React** (`lucide-react`)
- Notificaciones: **Sonner** via `toast()` de `sonner`

## Estilos

- **TailwindCSS 4** con utility classes
- Helper `cn()` de `@/lib/utils` para merge condicional de clases
- NO usar CSS modules, styled-components, ni inline styles
- Color primario del tema: `#2D8659` (verde ganadero)

## Estado

| Tipo de estado | Herramienta | Cuándo usar |
|---------------|-------------|-------------|
| Datos del servidor | TanStack Query | Listas, detalles, cualquier dato de la API |
| Auth / sesión | Zustand (`auth-store`) | Login state, user info |
| Notificaciones | Zustand (`notifications-store`) | Alertas, centro de notificaciones (persist, max 50) |
| Offline queue | Zustand (`offline-store`) | Acciones pendientes sin conexión |
| Formularios | React Hook Form | Estado local del formulario |
| UI temporal | `useState` | Modales, toggles, filtros locales |

## Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos de página | `page.tsx` | `app/dashboard/animales/page.tsx` |
| Componentes | PascalCase | `AnimalForm`, `TitularList` |
| Services | camelCase + `Service` | `animalesService`, `titularesService` |
| Types/Interfaces | PascalCase | `Animal`, `CreateAnimalDto` |
| Enums | PascalCase + UPPER_SNAKE values | `EstadoAnimal.ACTIVO` |
| Archivos componente | kebab-case | `animal-form.tsx` |
| Variables/funciones | camelCase (inglés) | `getAnimalById`, `handleSubmit` |
| Texto UI | Español | `"Guardar"`, `"Nombre del animal"` |

## Imports

- Usar alias `@/` para `src/`
- Orden: React → Next.js → libs externas → componentes → lib/api → types → utils

## Git

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- Rama principal: `main`
- Features: `feature/{nombre}`
- Fixes: `fix/{nombre}`
