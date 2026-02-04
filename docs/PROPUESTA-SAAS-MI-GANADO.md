# Propuesta SaaS y Contrato Anual - Mi Ganado

**Cliente:** María Auad  
**Modelo:** Software como Servicio (SaaS) dedicado  
**Horizonte:** Contrato anual (12 meses) con renovación automática  
**Fecha:** 3 de febrero de 2026  
**Preparado por:** Equipo de Desarrollo Mi Ganado

---

## 1. Resumen Ejecutivo

Esta propuesta traslada el cálculo de Puntos de Función (PF) del proyecto **Mi Ganado** a un **modelo de servicio SaaS administrado**, incluyendo operación, hosting y soporte continuo. El objetivo es entregar a la Sra. María Auad una solución llave en mano con un contrato anual que cubre:

1. **Onboarding & Puesta en Marcha:** Adecuaciones finales, carga inicial de datos, capacitación y despliegue productivo.  
2. **Licencia y Operación Mensual:** Uso ilimitado de la plataforma, infraestructura administrada (Railway + Vercel) y mesa de soporte.  
3. **Evolución Controlada:** 20% de la capacidad mensual reservada para mejoras priorizadas usando métricas PF.

| Indicador | Valor |
|-----------|-------|
| **Puntos de Función Ajustados (PFA)** | 374 PF (según documento oficial) |
| **Valor PF en CLP** | 374 PF × 399.000 CLP/PF = **CLP $149.226.000** *(tipo de cambio de referencia 1 USD = CLP $950)* |
| **Onboarding Único (20%)** | **CLP $29.850.000** |
| **Licencia Mensual (resto prorrateado)** | **CLP $9.950.000 / mes** |
| **Valor Anual Contratado** | **CLP $149.250.000** + infraestructura transferida |

> **Conclusión:** El PF respalda un valor total anual de CLP ~$149 MM. Se propone un esquema de 20% pago único + 12 cuotas mensuales que cubren operación, soporte y roadmap acordado.

---

## 2. Alcance Funcional y Metodología

- Se mantiene el inventario de funciones descrito en `CALCULO-PF-MI-GANADO.md`, con **374 PF ajustados** (ver documento de referencia).  
- El modelo SaaS no reduce funcionalidad: incluye **Gestión de Titulares, Establecimientos, Animales, Razas, Lotes, Pesajes (XR5000), Movimientos, Dashboard y Seguridad JWT+RBAC**.  
- Cualquier nueva funcionalidad se cuantificará usando PF para mantener trazabilidad y justificar incrementos en el fee mensual.

### Supuestos Financieros

1. **Tipo de cambio:** 1 USD = CLP $950 (promedio observado enero 2026).  
2. **Valor por PF:** USD $420 ≈ CLP $399.000.  
3. **Margen Operacional:** Incluido dentro del fee mensual para cubrir equipo de soporte, monitoreo y evolutivos.

---

## 3. Modelo de Servicio SaaS

| Pilar | Descripción |
|-------|-------------|
| **Operación 24/7** | Monitoreo de uptime, alertas automáticas, escalado de instancias Railway en picos de faena. |
| **Soporte Funcional** | Mesa de ayuda (SLA 4h en horario hábil, 24h en horario extendido). Gestión de incidencias y capacitación continua. |
| **Gestión de Datos** | Backups diarios en Railway Postgres + snapshots semanales exportados a Supabase Storage. |
| **Roadmap Controlado** | 20% del tiempo mensual (≈32 h) reservado para evolutivos priorizados con María Auad; se miden en PF para asegurar trazabilidad costo/beneficio. |
| **Seguridad** | Autenticación JWT, cifrado TLS extremo a extremo, roles ADMIN/PROFESSIONAL/PATIENT, auditoría básica de eventos. |
| **Cumplimiento** | Exportación de datos para SIPEC/SAG en formatos acordados y respaldo de documentación de movimientos. |

---

## 4. Infraestructura y Hosting

### 4.1 Componentes Base

| Componente | Proveedor | Plan sugerido | Costo USD | Costo CLP aprox. |
|------------|-----------|---------------|-----------|-------------------|
| Backend NestJS | Railway | Standard Service (1 GB RAM) | $20/mes | $19.000 |
| Base de Datos PostgreSQL | Railway | PostgreSQL 1 GB + backups | $30/mes | $28.500 |
| Frontend Next.js | Vercel | Pro (incluye Edge Functions y Analytics) | $20/mes | $19.000 |
| Alternativa Frontend | Railway | Service adicional (1 GB) | $20/mes | $19.000 |
| Dominio `miganado.cl` | NIC Chile | Renovación anual | $18.000/año | $18.000 |
| CDN/Storage | Vercel / Supabase | Incluido en planes base | - | - |

**Costo Infraestructura (Railway + Vercel):** ≈ CLP $95.500/mes + dominio (CLP $18.000/año).  
**Costo Infraestructura (Railway-only):** ≈ CLP $114.000/mes + dominio.

> **Nota:** Los costos de infraestructura se transfieren sin margen; se facturan junto al fee mensual o se cargan a la tarjeta del cliente para transparencia total.

### 4.2 Estrategia de Despliegue

1. **Backend y DB** en Railway (región US-EAST) con autoscale manual y variables de entorno cifradas.  
2. **Frontend** en Vercel para aprovechar CDN global; fallback Railway si se prefiere mantener todo en un solo proveedor.  
3. **Pipelines CI/CD** conectados a GitHub; deployments automáticos tras aprobación en main.  
4. **Observabilidad:** Logs centralizados en Railway + métricas básicas (CPU, memoria). Se ofrece upgrade a Axiom/NewRelic si se requiere.

---

## 5. Estructura Económica en CLP

### 5.1 Desglose del Contrato Anual

| Concepto | % PF | Monto CLP | Forma de pago |
|----------|------|-----------|---------------|
| **Onboarding & Go-Live** | 20% | **$29.850.000** | Pago único contra firma (incluye capacitación, migraciones, configuración dominio) |
| **Licencia + Operación** | 80% | **$119.400.000** | 12 cuotas mensuales de **$9.950.000** |
| **Infraestructura (Railway + Vercel + dominio)** | - | $95.500/mes + $18.000/año | Facturación a costo (se puede prorratear en la cuota mensual) |
| **TOTAL Año 1** | 100% | **$149.250.000** + infraestructura | Incluye soporte, roadmap y mantenimiento |

### 5.2 Distribución de la Licencia Mensual

| Rubro | % de la cuota | CLP / mes | Detalle |
|-------|---------------|-----------|---------|
| Operación & Soporte | 35% | $3.480.000 | Mesa de ayuda, monitoreo, guardias |
| Evolutivos (20 PF/mes) | 30% | $2.985.000 | 20% de capacidad mensual (~32 h) con priorización conjunta |
| Roadmap & QA | 15% | $1.490.000 | Testing regresivo, gestión de releases |
| Gestión de Proyecto | 10% | $995.000 | PM, reporting mensual, comités |
| Reserva de Riesgo | 10% | $995.000 | Contingencias, incidentes críticos |

### 5.3 Beneficio Económico

- **Costo mensual actual estimado (sin sistema):** CLP $12-15 MM (horas administrativas, errores, sanciones).  
- **Costo mensual del SaaS:** CLP $10.0 MM (licencia) + CLP $0.10 MM (infra).  
- **Ahorro directo estimado:** CLP $2-5 MM mensuales + reducción de multas SAG (CLP $4 MM promedio anual).  
- **ROI anual esperado:** 18-30% considerando ahorros y digitalización total.

---

## 6. Cronograma y Hitos

| Semana | Hito | Detalle |
|--------|------|---------|
| 1 | Firma + Kick-off | Pago onboarding, definición responsables, checklist técnico |
| 2-3 | Infraestructura dedicada | Configuración Railway, dominios, certificados SSL |
| 3-5 | Parametrización & Migración | Carga de titulares, establecimientos, lotes, históricos básicos |
| 6 | Capacitación Operativa | Sesiones para administradores y operadores en terreno |
| 7 | Puesta en Marcha Controlada | Paralelo en producción + soporte intensivo |
| 8 | Cierre Onboarding | Acta de aceptación, inicio de soporte recurrente |
| 9-52 | Operación + Evolutivos | Comité mensual, liberación de mejoras, reportes SLA |

---

## 7. Condiciones Contractuales

1. **Duración:** 12 meses, con renovación automática previa notificación 60 días antes.  
2. **SLA Operativo:** 99.5% uptime mensual. Créditos del 5% de la cuota si se incumple.  
3. **Soporte:** Horario hábil 09:00-18:00 CLT (SLA 4h). Guardia crítica 24/7 para caídas del sistema.  
4. **Propiedad Intelectual:** El software pertenece al proveedor; la data es 100% de María Auad.  
5. **Terminación Anticipada:** Penalidad equivalente a 2 cuotas para cubrir costos hundidos.  
6. **Ajustes por Inflación:** IPC anual aplicado a partir del segundo año.  
7. **Infraestructura:** Se puede facturar directo al cliente o incluido con comprobantes; cualquier upgrade se cotiza previamente.  
8. **Evolutivos fuera de la bolsa PF mensual:** Se cotizan por separado usando el mismo valor PF (CLP $399.000 / PF).

---

## 8. Próximos Pasos

1. **Revisión de la propuesta** con la Sra. María y definición del modelo de hosting preferido (Railway-only vs Railway + Vercel).  
2. **Aprobación del contrato** y emisión de orden de compra/pago del onboarding.  
3. **Kick-off técnico y comercial** dentro de los 5 días hábiles posteriores a la firma.  
4. **Entrega de credenciales e inventario de datos** para iniciar la carga inicial.  
5. **Planificación del comité mensual** para priorizar evolutivos en el ciclo SaaS.

---

**Documento confidencial. Prohibida su difusión sin autorización expresa del Equipo Mi Ganado.**
