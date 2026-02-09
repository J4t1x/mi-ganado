---
description: Operaciones con Vercel CLI para mi-ganado (deploy, inspect, env, rollback)
---

Workflow para operar el proyecto mi-ganado en Vercel desde la terminal.

## 1. Pre-checks

// turbo
1. Verificar CLI instalado: `vercel --version`
2. Verificar proyecto vinculado: `cat .vercel/project.json`
3. Si no está vinculado: `vercel link --yes`

## 2. Ver estado de deployments

// turbo
1. Listar deployments recientes: `vercel ls`
2. Inspeccionar deploy actual: `vercel inspect miganado.vercel.app`
3. Ver aliases configurados (dominios): buscar sección "Aliases" en el output de inspect

## 3. Deploy manual (hotfix)

Usar solo cuando se necesita deploy urgente sin esperar el pipeline de GitHub.

1. Verificar build local: `npm run lint && npm run build`
2. Deploy a producción: `vercel --prod`
3. Verificar resultado: `vercel inspect miganado.vercel.app`
4. Hacer commit y push para que el repo quede sincronizado:
   ```
   git add . && git commit -m "hotfix: descripción" && git push origin main
   ```

## 4. Gestión de variables de entorno

### Ver variables actuales
// turbo
1. Listar variables: `vercel env ls`

### Agregar variable
1. Agregar a producción: `vercel env add NOMBRE_VARIABLE production`
2. Agregar a preview: `vercel env add NOMBRE_VARIABLE preview`
3. Agregar a development: `vercel env add NOMBRE_VARIABLE development`

### Sincronizar a local
// turbo
1. Descargar env de development: `vercel env pull .env.local`
2. Descargar env de producción: `vercel env pull .env.production`

### Rotar secreto
1. Eliminar variable: `vercel env rm NOMBRE_VARIABLE production`
2. Agregar nueva: `vercel env add NOMBRE_VARIABLE production`
3. Redesplegar: `vercel --prod`

## 5. Rollback

1. Listar deployments: `vercel ls`
2. Identificar el deployment anterior al problemático
3. Ejecutar rollback: `vercel rollback <deployment-url-o-id>`
4. Verificar: `vercel inspect miganado.vercel.app`
5. Documentar incidente en `docs/troubleshooting/`

## 6. Dominios

// turbo
1. Listar dominios: `vercel domains ls`
2. Verificar DNS: `vercel domains inspect miganado.cl`

### Agregar dominio
1. Agregar: `vercel domains add <dominio>`
2. Configurar DNS según instrucciones del output
3. Verificar SSL: `vercel certs ls`

## 7. Troubleshooting

### "command not found: vercel"
- Instalar: `npm install -g vercel`

### "No existing credentials found"
- Login: `vercel login`

### "Your codebase isn't linked"
- Vincular: `vercel link --yes`

### Deploy falla en Vercel pero build local pasa
- Comparar Node version: verificar en Vercel Dashboard → Settings → General → Node.js Version
- Verificar env vars en Vercel: `vercel env ls`
- Revisar logs del build en Vercel Dashboard → Deployments → click en el deploy fallido
