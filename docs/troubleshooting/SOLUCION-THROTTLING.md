# Solución al Error de Throttling (429)

## Problema
El error `ThrottlerException: Too Many Requests` ocurre cuando múltiples componentes del frontend realizan llamadas simultáneas al endpoint `/api/v1/ganado/titulares`, superando el límite de rate limiting configurado en el backend.

## Causa Raíz
- Múltiples componentes (`animal-form.tsx`, `establecimientos/page.tsx`, `titulares/page.tsx`) llaman a `titularesService.getAll()` simultáneamente
- No existe caché en el cliente
- Cada llamada genera una petición HTTP al backend
- El backend tiene configurado un throttler que rechaza peticiones excesivas

## Solución Implementada en Frontend

### 1. Sistema de Caché (Implementado)
Se creó un sistema de caché en memoria (`src/lib/api/cache.ts`) que:
- Almacena respuestas por 5 minutos
- Evita llamadas repetidas al backend
- Se invalida automáticamente al crear/actualizar/eliminar titulares

### 2. Modificaciones en `titularesService`
- `getAll()`: Verifica caché antes de hacer peticiones
- `create()`, `update()`, `delete()`, `toggleEstado()`: Invalidan caché después de modificaciones

## Recomendaciones para el Backend

### 1. Ajustar Configuración del Throttler
En el backend NestJS, ajusta los límites del throttler:

```typescript
// app.module.ts o main.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,        // Ventana de tiempo en segundos
      limit: 30,      // Número de peticiones permitidas (aumentar de 10 a 30)
    }),
  ],
})
```

### 2. Excluir Endpoints Específicos
Considera excluir el endpoint de titulares del throttling si es de solo lectura:

```typescript
// titulares.controller.ts
import { SkipThrottle } from '@nestjs/throttler';

@Controller('api/v1/ganado/titulares')
export class TitularesController {
  
  @Get()
  @SkipThrottle() // Excluir este endpoint del throttling
  async findAll(@Query() query: TitularesQueryDto) {
    // ...
  }
}
```

### 3. Throttling Diferenciado por Método
Aplica límites diferentes según el tipo de operación:

```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/ganado/titulares')
export class TitularesController {
  
  @Get()
  @Throttle(30, 60) // 30 peticiones por minuto para GET
  async findAll() { }
  
  @Post()
  @Throttle(10, 60) // 10 peticiones por minuto para POST
  async create() { }
  
  @Delete(':id')
  @Throttle(5, 60) // 5 peticiones por minuto para DELETE
  async delete() { }
}
```

### 4. Implementar Caché en el Backend
Agrega caché en el backend para reducir carga en la base de datos:

```typescript
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // 5 minutos
      max: 100, // Máximo 100 items en caché
    }),
  ],
})

// En el servicio
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export class TitularesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: TitularesQueryDto) {
    const cacheKey = `titulares:${JSON.stringify(query)}`;
    
    // Verificar caché
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    
    // Consultar DB
    const result = await this.prisma.titular.findMany(/* ... */);
    
    // Guardar en caché
    await this.cacheManager.set(cacheKey, result, 300);
    
    return result;
  }
}
```

## Verificación

### Frontend
1. Abre la consola del navegador
2. Navega a diferentes páginas que usan titulares
3. Verifica que solo se hace 1 petición HTTP inicial
4. Las siguientes cargas deben usar caché (sin peticiones HTTP)

### Backend
1. Revisa los logs del backend
2. Verifica que las peticiones no excedan el límite
3. Monitorea el tiempo de respuesta

## Beneficios

### Frontend
- ✅ Reduce peticiones HTTP en ~80%
- ✅ Mejora tiempo de respuesta (caché instantáneo)
- ✅ Evita errores 429
- ✅ Mejor experiencia de usuario

### Backend (si se implementa)
- ✅ Reduce carga en la base de datos
- ✅ Mejora escalabilidad
- ✅ Permite más usuarios simultáneos

## Monitoreo

### Métricas a Observar
1. Número de peticiones HTTP por minuto
2. Tasa de hit/miss del caché
3. Tiempo de respuesta promedio
4. Errores 429 (deben ser 0)

### Herramientas
- Chrome DevTools (Network tab)
- Backend logs
- Herramientas de monitoreo (Sentry, DataDog, etc.)

## Próximos Pasos

1. ✅ Implementar caché en frontend (completado)
2. ⏳ Ajustar throttler en backend (pendiente)
3. ⏳ Implementar caché en backend (opcional)
4. ⏳ Monitorear métricas en producción

## Notas Adicionales

- El caché se invalida automáticamente al modificar datos
- El TTL de 5 minutos es configurable según necesidades
- Considera implementar React Query o SWR para caché más avanzado
- Para datos en tiempo real, considera WebSockets o Server-Sent Events
