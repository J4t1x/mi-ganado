# Plan: Landing Page — Mi Ganado

Crear una landing page pública de conversión para vender Mi Ganado como SaaS de gestión ganadera digital, coherente con el design system existente (`#2D8659`, shadcn/ui, TailwindCSS 4, Framer Motion).

---

## Estado actual

- `app/page.tsx` actualmente hace `redirect('/dashboard')` — se reemplazará con la landing
- El dashboard protegido vive en `app/dashboard/`
- Auth vive en `app/(auth)/`
- Design system: CSS variables en `globals.css` con paleta verde ganadero (oklch), shadcn/ui (22 componentes), Framer Motion ya instalado
- Fuentes: Inter (sans) + JetBrains Mono
- Analytics y SpeedInsights ya integrados en `layout.tsx`

## Decisiones de arquitectura

| Decisión | Elección | Razón |
|----------|----------|-------|
| **Ruta** | `app/page.tsx` | Es la home natural (`/`). Usuarios autenticados pueden navegar a `/dashboard` desde la landing |
| **Rendering** | Página estática (no `'use client'` en page, secciones client individuales) | SEO + performance |
| **Componentes** | Carpeta `src/components/landing/` | Separación clara del dashboard |
| **Animaciones** | Componente reutilizable `<AnimateOnScroll>` con Framer Motion | DRY, consistencia |
| **Metadata** | Open Graph + Twitter Cards en `page.tsx` metadata export | SEO social |

---

## Estructura de archivos

```
src/
├── app/
│   └── page.tsx                          # Landing page (reemplaza redirect)
├── components/
│   └── landing/
│       ├── landing-header.tsx            # Navbar público (logo + links + CTA)
│       ├── hero-section.tsx              # Hero con headline + CTA + mockup
│       ├── problems-section.tsx          # Pain points → solución (cards animadas)
│       ├── features-section.tsx          # 8 módulos con iconos Lucide
│       ├── metrics-section.tsx           # Números de impacto (counter animation)
│       ├── pricing-section.tsx           # 3 planes + toggle mensual/anual
│       ├── comparison-section.tsx        # Tabla comparativa vs competencia
│       ├── cta-section.tsx              # CTA final con captura de email
│       ├── landing-footer.tsx            # Footer con links y contacto
│       └── animate-on-scroll.tsx         # Wrapper Framer Motion reutilizable
```

---

## Secciones — Wireframe textual + Copy

### 1. Header (landing-header.tsx)
- **Layout:** Logo Mi Ganado (icono Beef + texto) | Links: Funcionalidades · Precios · Contacto | CTA: "Iniciar sesión" (outline) + "Comenzar gratis" (primary)
- **Comportamiento:** Sticky, fondo transparente → blanco al scroll, mobile hamburger menu
- **Nota:** Diferente al `Header` del dashboard (no usa auth store)

### 2. Hero Section (hero-section.tsx)
- **Headline:** "Gestiona tu ganado con la potencia de la tecnología"
- **Subtítulo:** "Plataforma digital para centralizar trazabilidad, cumplimiento SIPEC/SAG y operaciones ganaderas. Funciona incluso sin conexión a internet."
- **CTA primario:** "Comenzar prueba gratis" (botón grande, verde)
- **CTA secundario:** "Ver demo" (botón outline)
- **Visual:** Gradiente verde sutil de fondo + placeholder para mockup del dashboard (div con borde redondeado simulando screenshot)
- **Animación:** Fade-in + slide-up al cargar

### 3. Problema → Solución (problems-section.tsx)
- **Título sección:** "Los desafíos que enfrentas hoy"
- **6 cards** (grid 1col mobile, 2col sm, 3col md):

| Problema | Icono | Solución Mi Ganado |
|----------|-------|--------------------|
| Registros manuales propensos a errores | FileX | Digitalización completa con validaciones automáticas |
| Zonas sin conectividad | WifiOff | PWA offline-first, sincronización automática |
| Riesgo de multas SAG | AlertTriangle | Cumplimiento SIPEC/SAG integrado |
| Datos dispersos en planillas | FileSpreadsheet | Centralización en una sola plataforma |
| Equipos de pesaje aislados | Scale | Importación directa desde XR5000 |
| Sin visibilidad financiera | TrendingDown | Control de costos, ventas y rentabilidad |

- **Animación:** Cards con stagger fade-in al scroll

### 4. Funcionalidades (features-section.tsx)
- **Título:** "Todo lo que necesitas en un solo lugar"
- **Subtítulo:** "8 módulos diseñados para la operación ganadera real"
- **Layout:** Grid 2col mobile, 4col desktop. Cada feature: icono Lucide en círculo verde + título + descripción 1 línea
- **Features:**
  1. Beef → "Gestión de Animales" — "DIIO, RFID, trazabilidad SIPEC completa"
  2. Building2 → "Multi-establecimiento" — "Controla todos tus predios y RUPs"
  3. Scale → "Pesajes XR5000" — "Importación automática desde tu balanza"
  4. ArrowRightLeft → "Movimientos" — "Traslados, ventas, compras y bajas"
  5. Syringe → "Módulo Sanitario" — "Calendario, alertas y registro de manejos"
  6. DollarSign → "Control Financiero" — "Costos, ventas y rentabilidad en tiempo real"
  7. BarChart3 → "Dashboard y Reportes" — "Gráficos interactivos y exportación CSV"
  8. WifiOff → "Modo Offline" — "Trabaja sin conexión, sincroniza después"
- **Animación:** Fade-in stagger por item

### 5. Métricas de impacto (metrics-section.tsx)
- **Fondo:** Verde primario con texto blanco
- **Layout:** 4 columnas (1col mobile, 2col sm, 4col md)
- **Métricas:**
  - "80%" — "Menos errores de registro"
  - "45 hrs/mes" — "Ahorradas en gestión"
  - "100%" — "Disponibilidad en terreno"
  - "< 9 meses" — "Retorno de inversión"
- **Animación:** Counter numérico animado al entrar en viewport

### 6. Planes y precios (pricing-section.tsx)
- **Título:** "Planes que se adaptan a tu operación"
- **Toggle:** Mensual / Anual (descuento 20%)
- **3 cards:**

| | Starter | Profesional | Empresa |
|---|---------|-------------|---------|
| **Target** | Hasta 200 animales | Animales ilimitados | Multi-usuario |
| **Precio placeholder** | $XX.XXX/mes | $XX.XXX/mes | Contactar |
| **Módulos** | Animales, establecimientos, pesajes, reportes | Todos los módulos | Todo + personalización |
| **Soporte** | Email | Email + chat | 24/7 prioritario |
| **Extras** | — | XR5000, financiero, sanitario | Onboarding, SLA 99.5%, evolutivos |
| **CTA** | "Comenzar gratis" | "Elegir plan" (destacado) | "Contactar ventas" |
| **Badge** | — | "Más popular" | — |

- Plan Profesional visualmente destacado (borde verde, escala mayor, badge)
- **Animación:** Fade-in al scroll

### 7. Comparación (comparison-section.tsx)
- **Título:** "¿Por qué elegir Mi Ganado?"
- **Tabla responsive** (cards en mobile, tabla en md+):

| Feature | Mi Ganado | Otros |
|---------|-----------|-------|
| Animales ilimitados | ✅ | ❌ Límites por plan |
| Importación XR5000 | ✅ | ❌ Solo manual |
| Modo offline (PWA) | ✅ | ❌ Requiere conexión |
| Actualizaciones incluidas | ✅ | 💰 Costo extra |
| Multi-establecimiento | ✅ | ✅ Parcial |
| Soporte en español | ✅ | ⚠️ Limitado |

### 8. CTA Final (cta-section.tsx)
- **Fondo:** Gradiente verde oscuro → verde primario
- **Headline:** "Transforma tu operación ganadera hoy"
- **Subtítulo:** "Únete a los ganaderos que ya digitalizaron su gestión. Sin tarjeta de crédito, sin compromisos."
- **CTA primario:** "Comenzar ahora" (botón blanco grande)
- **CTA secundario:** "Agendar demo personalizada" (botón outline blanco)
- **Input email:** Campo + botón "Enviar" para captura de leads
- **Animación:** Fade-in

### 9. Footer (landing-footer.tsx)
- **Layout:** 3 columnas (stack en mobile)
  - Col 1: Logo + descripción corta + "Transformando la ganadería chilena"
  - Col 2: Links — Funcionalidades · Precios · Iniciar sesión · Registrarse
  - Col 3: Contacto — contacto@miganado.cl · WhatsApp · miganado.cl
- **Bottom bar:** "© 2026 Mi Ganado. Todos los derechos reservados." + links Términos · Privacidad

---

## Pasos de implementación

### Fase 1: Infraestructura (1 paso)
1. **Crear `animate-on-scroll.tsx`** — Componente wrapper con Framer Motion (`useInView` + `motion.div`) para reutilizar en todas las secciones

### Fase 2: Componentes de sección (9 pasos)
2. **`landing-header.tsx`** — Navbar público con logo, links de ancla, CTAs, sticky + mobile menu
3. **`hero-section.tsx`** — Hero con headline, subtítulo, CTAs, mockup placeholder, gradiente
4. **`problems-section.tsx`** — 6 cards de problema→solución con iconos Lucide
5. **`features-section.tsx`** — Grid de 8 módulos con iconos y descripciones
6. **`metrics-section.tsx`** — 4 métricas con fondo verde y números animados
7. **`pricing-section.tsx`** — 3 planes con toggle mensual/anual, badges, CTAs
8. **`comparison-section.tsx`** — Tabla comparativa responsive
9. **`cta-section.tsx`** — CTA final con gradiente, email capture, doble botón
10. **`landing-footer.tsx`** — Footer con 3 columnas y bottom bar

### Fase 3: Ensamblaje (1 paso)
11. **Reemplazar `app/page.tsx`** — Importar todas las secciones, agregar metadata (OG + Twitter Cards), exportar como página estática

### Fase 4: Pulido (1 paso)
12. **Revisión final** — Verificar responsive (mobile/tablet/desktop), accesibilidad (contraste, alt texts, keyboard nav), animaciones suaves, links de ancla funcionales

---

## Dependencias

- **Ninguna nueva** — Todo el stack necesario ya está instalado:
  - `framer-motion` 12.29.2 ✅
  - `lucide-react` 0.563.0 ✅
  - shadcn/ui components (Button, Badge, Card, Separator, Switch) ✅
  - TailwindCSS 4 ✅

## Notas

- Los precios son **placeholder** (`$XX.XXX`) — se definirán después
- El email capture es **visual** (no conectado a backend) — se puede integrar después con Supabase o un servicio de email
- No se crean imágenes/mockups reales — se usan placeholders con bordes y gradientes
- El componente `Switch` de shadcn/ui se usará para el toggle mensual/anual del pricing
