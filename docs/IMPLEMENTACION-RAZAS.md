# Implementación de Razas por Especie

## Descripción

Se ha implementado la funcionalidad de **Razas** en el módulo de gestión de ganado, permitiendo que cada animal tenga asociada una raza específica que está vinculada a su especie.

## Características Principales

### 1. Filtrado Dinámico
- Al seleccionar una especie en el formulario de animal, automáticamente se filtran las razas disponibles para esa especie
- Si se cambia la especie, la raza seleccionada se limpia automáticamente
- El selector de raza se deshabilita hasta que se seleccione una especie

### 2. Validación
- La raza es un campo opcional en el formulario
- Solo se muestran razas activas y asociadas a la especie seleccionada

## Cambios Implementados

### 1. Tipos e Interfaces (`src/types/index.ts`)

#### Nueva Interface: Raza
```typescript
export interface Raza {
  id: string;
  nombre: string;
  especie: Especie;
  descripcion?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
}
```

#### Actualización de Animal
```typescript
export interface Animal {
  // ... campos existentes
  razaId?: string;  // ← Nuevo campo
  raza?: Raza;      // ← Nueva relación
}
```

#### Actualización de DTOs
```typescript
export interface CreateAnimalDto {
  especie?: Especie;
  razaId?: string;  // ← Nuevo campo
  // ... otros campos
}

export interface UpdateAnimalDto {
  especie?: Especie;
  razaId?: string;  // ← Nuevo campo
  // ... otros campos
}
```

### 2. Servicio API (`src/lib/api/razas.ts`)

Nuevo servicio para gestionar razas con los siguientes métodos:

- **`getAll(params?)`**: Obtiene todas las razas con paginación y filtros
- **`getByEspecie(especie)`**: Obtiene razas filtradas por especie (usado en el formulario)
- **`getById(id)`**: Obtiene una raza específica por ID

```typescript
// Ejemplo de uso
const razas = await razasService.getByEspecie(Especie.BOVINO);
```

### 3. Formulario de Animales (`src/components/animales/animal-form.tsx`)

#### Nuevos Estados
```typescript
const [razas, setRazas] = useState<any[]>([]);
const [loadingRazas, setLoadingRazas] = useState(false);
const selectedEspecie = watch('especie');
```

#### Efecto de Filtrado
```typescript
useEffect(() => {
  if (selectedEspecie) {
    loadRazas(selectedEspecie);
    setValue('razaId', undefined); // Limpia la raza al cambiar especie
  }
}, [selectedEspecie]);
```

#### Función de Carga
```typescript
const loadRazas = async (especie: Especie) => {
  setLoadingRazas(true);
  try {
    const razasData = await razasService.getByEspecie(especie);
    setRazas(razasData || []);
  } catch (error) {
    console.error('Error loading razas:', error);
    setRazas([]);
  } finally {
    setLoadingRazas(false);
  }
};
```

#### Selector de Raza
- Se ubica entre el selector de Especie y el selector de Sexo
- Se deshabilita si no hay especie seleccionada o si está cargando
- Muestra un loader mientras carga las razas
- Muestra mensaje si no hay razas disponibles

### 4. Vista de Detalle (`src/app/dashboard/animales/[id]/page.tsx`)

Se agregó la visualización de la raza en la sección de "Información General":

```typescript
<div>
  <p className="text-sm text-muted-foreground">Raza</p>
  <p className="font-medium">{animal.raza?.nombre || 'No especificada'}</p>
</div>
```

## Flujo de Usuario

### Crear/Editar Animal

1. Usuario selecciona una **Especie** (ej: BOVINO)
2. El sistema automáticamente:
   - Carga las razas asociadas a esa especie
   - Habilita el selector de raza
   - Muestra las razas disponibles
3. Usuario selecciona una **Raza** (opcional)
4. Si el usuario cambia la especie:
   - La raza seleccionada se limpia
   - Se cargan las nuevas razas de la especie seleccionada

### Ver Detalle de Animal

- En la tarjeta de "Información General"
- Se muestra la raza asociada al animal
- Si no tiene raza, muestra "No especificada"

## Requisitos del Backend

Para que esta implementación funcione correctamente, el backend debe proporcionar:

### 1. Endpoint de Razas
```
GET /api/v1/ganado/razas?especie={ESPECIE}&limit=100
```

**Respuesta esperada:**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Angus",
      "especie": "BOVINO",
      "descripcion": "Raza de carne",
      "estado": "ACTIVO",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

### 2. Actualización del Modelo Animal

El backend debe:
- Aceptar `razaId` en los DTOs de creación y actualización
- Incluir la relación `raza` al retornar animales
- Validar que la raza pertenezca a la especie del animal

## Ejemplos de Razas por Especie

### BOVINO
- Angus
- Hereford
- Holstein
- Jersey
- Charolais

### OVINO
- Merino
- Suffolk
- Corriedale
- Romney Marsh

### CAPRINO
- Saanen
- Anglo Nubian
- Boer
- Alpina

### PORCINO
- Yorkshire
- Landrace
- Duroc
- Hampshire

### EQUINO
- Criollo
- Pura Sangre
- Cuarto de Milla
- Árabe

## Consideraciones Técnicas

### Performance
- Las razas se cargan solo cuando se selecciona una especie
- Se usa caché del navegador (`cache: 'no-store'`) para datos actualizados
- Límite de 100 razas por especie (ajustable)

### UX/UI
- Feedback visual durante la carga (spinner)
- Selector deshabilitado hasta seleccionar especie
- Mensajes claros cuando no hay razas disponibles
- Limpieza automática al cambiar especie

### Validación
- Campo opcional (no obligatorio)
- Validación en el backend de que la raza corresponda a la especie

## Testing

### Casos de Prueba

1. **Seleccionar especie sin raza**
   - ✓ El animal se crea sin raza

2. **Seleccionar especie y raza**
   - ✓ El animal se crea con la raza asociada

3. **Cambiar especie después de seleccionar raza**
   - ✓ La raza se limpia automáticamente
   - ✓ Se cargan las razas de la nueva especie

4. **Ver detalle de animal con raza**
   - ✓ Se muestra el nombre de la raza

5. **Ver detalle de animal sin raza**
   - ✓ Se muestra "No especificada"

## Próximas Mejoras

- [ ] Agregar gestión de razas (CRUD) en el panel de administración
- [ ] Permitir crear razas personalizadas por usuario
- [ ] Agregar filtro por raza en la lista de animales
- [ ] Mostrar estadísticas por raza en el dashboard
- [ ] Agregar campo de descripción/características de la raza

## Notas de Migración

Si ya existen animales en la base de datos:
- El campo `razaId` es opcional, por lo que los animales existentes seguirán funcionando
- Se puede ejecutar una migración para asignar razas a animales existentes basándose en su especie
- No se requiere actualización de datos existentes para que el sistema funcione
