'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Home,
  Beef,
  Package,
  Scale,
  ArrowRightLeft,
  Syringe,
  DollarSign,
  Settings,
  Search,
  Lightbulb,
  CheckCircle,
  ListOrdered,
  Zap,
  Building2,
  Users,
  Dna,
  Bell,
  Lock,
  BarChart3,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';

const modules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    color: 'bg-blue-100 text-blue-600',
    href: '/dashboard',
    shortDesc: 'Resumen general y estadísticas de tu operación ganadera',
    whatIs: 'El Dashboard es tu pantalla principal. Muestra un resumen en tiempo real de toda tu operación: cantidad de ganado, lotes activos, pesajes recientes y movimientos del mes.',
    howTo: [
      'Al ingresar a la aplicación, el Dashboard se carga automáticamente',
      'Las tarjetas superiores muestran los indicadores clave con su variación mensual',
      'La tabla de "Últimos Movimientos" muestra los traslados, ventas y compras recientes',
      'El gráfico circular muestra la distribución de animales por estado (activo, vendido, muerto)',
      'El gráfico de barras muestra el stock por establecimiento',
    ],
    actions: [
      { icon: RefreshCw, text: 'Actualizar datos manualmente' },
      { icon: Plus, text: 'Acceso rápido a "Nuevo Animal"' },
    ],
    tips: [
      'Los datos se actualizan automáticamente cada 30 segundos',
      'Las flechas verdes (↑) y rojas (↓) indican la tendencia respecto al mes anterior',
    ],
  },
  {
    id: 'ganado',
    name: 'Ganado',
    icon: Beef,
    color: 'bg-green-100 text-green-600',
    href: '/dashboard/animales',
    shortDesc: 'Registro y gestión completa de tus animales',
    whatIs: 'El módulo de Ganado es el corazón de la aplicación. Aquí registras, consultas y gestionas cada animal de tu plantel con su identificación (DIIO, RFID), datos de trazabilidad, establecimiento y lote asignado.',
    howTo: [
      'Haz clic en "Nuevo Animal" para registrar un animal con su DIIO y datos básicos',
      'Usa la barra de búsqueda para encontrar animales por número de DIIO o RFID',
      'Filtra por estado (Activo, Vendido, Muerto) con el selector de la derecha',
      'Haz clic en un animal de la lista para ver su ficha completa con historial',
      'Desde el menú de acciones (⋮) puedes editar, registrar pesaje o dar de baja',
    ],
    actions: [
      { icon: Plus, text: 'Nuevo Animal — registrar animal con identificadores' },
      { icon: Eye, text: 'Ver detalle — ficha completa del animal' },
      { icon: Edit, text: 'Editar — modificar datos del animal' },
      { icon: Scale, text: 'Registrar pesaje — agregar peso al animal' },
      { icon: Trash2, text: 'Dar de baja — cambiar estado a vendido/muerto' },
      { icon: Download, text: 'Exportar CSV — descargar listado filtrado' },
      { icon: Upload, text: 'Importar — carga masiva de animales' },
    ],
    tips: [
      'El DIIO (Dispositivo de Identificación Individual Oficial) es obligatorio para cada animal',
      'Los toros pueden tener además un chip RFID para identificación electrónica',
      'Exporta a CSV para trabajar los datos en Excel o compartirlos con tu veterinario',
    ],
  },
  {
    id: 'lotes',
    name: 'Lotes',
    icon: Package,
    color: 'bg-purple-100 text-purple-600',
    href: '/dashboard/lotes',
    shortDesc: 'Agrupa animales por criterio para facilitar la gestión',
    whatIs: 'Los Lotes permiten agrupar animales por criterio productivo: engorda, vacas paridas, recría, terneros, etc. Facilitan el manejo grupal de pesajes, movimientos y eventos sanitarios.',
    howTo: [
      'Crea un lote con nombre descriptivo (ej: "Engorda Invierno 2026")',
      'Asigna un establecimiento al lote',
      'Desde el módulo de Ganado, asigna animales al lote',
      'Consulta el peso promedio y cantidad de animales por lote',
    ],
    actions: [
      { icon: Plus, text: 'Nuevo Lote — crear agrupación de animales' },
      { icon: Eye, text: 'Ver detalle — animales del lote y estadísticas' },
      { icon: Edit, text: 'Editar — cambiar nombre, descripción o establecimiento' },
    ],
    tips: [
      'Un animal solo puede pertenecer a un lote a la vez',
      'Usa lotes para organizar sesiones de pesaje: pesa un lote completo en una sesión',
      'Los lotes facilitan los movimientos grupales entre establecimientos',
    ],
  },
  {
    id: 'pesajes',
    name: 'Pesajes',
    icon: Scale,
    color: 'bg-orange-100 text-orange-600',
    href: '/dashboard/pesajes',
    shortDesc: 'Control de peso con sesiones y estadísticas',
    whatIs: 'El módulo de Pesajes organiza los registros de peso en sesiones. Cada sesión agrupa los pesajes realizados en una fecha con un equipo específico, permitiendo calcular promedios, mínimos y máximos.',
    howTo: [
      'Crea una nueva sesión de pesaje indicando fecha, equipo y operador',
      'Agrega pesajes individuales dentro de la sesión (animal + peso)',
      'Opcionalmente, importa datos directamente desde una balanza XR5000',
      'Consulta las estadísticas de cada sesión: promedio, mínimo, máximo',
      'Compara sesiones para evaluar la ganancia de peso en el tiempo',
    ],
    actions: [
      { icon: Plus, text: 'Nueva Sesión — crear sesión de pesaje' },
      { icon: Plus, text: 'Agregar Pesaje — registrar peso individual' },
      { icon: Upload, text: 'Importar XR5000 — carga desde balanza electrónica' },
      { icon: Download, text: 'Exportar CSV — descargar datos de pesaje' },
    ],
    tips: [
      'Registra pesajes periódicos (cada 15-30 días) para monitorear la ganancia diaria de peso (GDP)',
      'La importación desde XR5000 ahorra tiempo al pesar lotes grandes',
      'El peso promedio del lote se actualiza automáticamente con cada pesaje',
    ],
  },
  {
    id: 'movimientos',
    name: 'Movimientos',
    icon: ArrowRightLeft,
    color: 'bg-cyan-100 text-cyan-600',
    href: '/dashboard/movimientos',
    shortDesc: 'Traslados, ventas, compras y registros de muerte',
    whatIs: 'Los Movimientos registran todo desplazamiento o cambio de estado del ganado: traslados entre establecimientos, ventas a terceros, compras, muertes y ajustes de inventario.',
    howTo: [
      'Haz clic en "Nuevo Movimiento" y selecciona el tipo (Traslado, Venta, Compra, Muerte)',
      'Indica el establecimiento de origen y destino (según el tipo)',
      'Agrega los animales involucrados en el movimiento',
      'Guarda como "Borrador" si aún no está listo',
      'Confirma el movimiento cuando todo esté correcto — esto actualiza la ubicación de los animales',
    ],
    actions: [
      { icon: Plus, text: 'Nuevo Movimiento — registrar traslado, venta, compra o muerte' },
      { icon: Eye, text: 'Ver detalle — animales y documentos del movimiento' },
      { icon: CheckCircle, text: 'Confirmar — ejecutar el movimiento y actualizar ubicaciones' },
    ],
    tips: [
      'Usa "Borrador" para preparar movimientos con anticipación',
      'Al confirmar un traslado, los animales cambian automáticamente de establecimiento',
      'Las ventas confirmadas se reflejan en el módulo Financiero',
      'Cada movimiento queda registrado como trazabilidad del animal',
    ],
  },
  {
    id: 'sanitario',
    name: 'Sanitario',
    icon: Syringe,
    color: 'bg-red-100 text-red-600',
    href: '/dashboard/sanitario',
    shortDesc: 'Vacunaciones, tratamientos y calendario sanitario',
    whatIs: 'El módulo Sanitario gestiona todos los eventos de salud animal: vacunaciones, tratamientos, desparasitaciones, exámenes y cirugías. Incluye un calendario de próximos eventos para no olvidar ninguna dosis.',
    howTo: [
      'Haz clic en "Nuevo Evento" para registrar una vacunación o tratamiento',
      'Selecciona el tipo, producto, dosis, vía de aplicación y veterinario',
      'Indica la fecha de próxima dosis si corresponde',
      'Consulta la pestaña "Próximos" para ver los eventos programados en los próximos 30 días',
      'Los eventos vencidos se marcan automáticamente en rojo',
    ],
    actions: [
      { icon: Plus, text: 'Nuevo Evento — registrar vacunación, tratamiento, etc.' },
      { icon: Calendar, text: 'Próximos — ver calendario de eventos programados' },
      { icon: Download, text: 'Exportar CSV — descargar historial sanitario' },
    ],
    tips: [
      'Programa siempre la fecha de próxima dosis para recibir alertas',
      'Los colores en el calendario indican urgencia: rojo (≤3 días), amarillo (≤7 días), azul (>7 días)',
      'Registra el período de resguardo para controlar cuándo un animal puede ser comercializado',
      'El campo "Lote de producto" ayuda a rastrear el lote de la vacuna utilizada',
    ],
  },
  {
    id: 'financiero',
    name: 'Financiero',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-600',
    href: '/dashboard/financiero',
    shortDesc: 'Costos, ventas y rentabilidad de tu operación',
    whatIs: 'El módulo Financiero registra todos los costos operativos y las ventas de ganado. Calcula automáticamente la rentabilidad y muestra la distribución de gastos por categoría.',
    howTo: [
      'En la pestaña "Costos", registra gastos de alimentación, sanitario, mano de obra, transporte, etc.',
      'En la pestaña "Ventas", registra cada venta con comprador, cantidad, precio y forma de pago',
      'Las tarjetas superiores muestran: Total Costos, Total Ventas, Rentabilidad y Ventas Pendientes',
      'El gráfico circular muestra cómo se distribuyen tus costos por categoría',
      'Marca las ventas como "Pagada" cuando recibas el pago',
    ],
    actions: [
      { icon: Plus, text: 'Nuevo Costo — registrar gasto operativo' },
      { icon: Plus, text: 'Nueva Venta — registrar venta de ganado' },
      { icon: Download, text: 'Exportar CSV — descargar costos o ventas' },
    ],
    tips: [
      'Registra todos los costos, incluso los pequeños, para tener una rentabilidad real',
      'El precio total de la venta se calcula automáticamente (cantidad × precio unitario)',
      'Usa el campo "Factura" para vincular el número de documento tributario',
      'La rentabilidad = Total Ventas − Total Costos',
    ],
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    icon: Settings,
    color: 'bg-gray-100 text-gray-600',
    href: '/dashboard/configuracion',
    shortDesc: 'Titulares, establecimientos, razas y ajustes de cuenta',
    whatIs: 'La sección de Configuración permite administrar los datos maestros de tu operación: titulares (propietarios), establecimientos (predios), razas y ajustes de tu cuenta.',
    howTo: [
      'Configura primero un Titular con nombre, RUT y datos de contacto',
      'Luego crea los Establecimientos (predios) con su RUP, vinculados al titular',
      'Agrega las Razas que manejas en tu plantel',
      'Desde "Contraseña" puedes cambiar tu clave de acceso',
      'En "Alertas" configura las notificaciones que deseas recibir',
    ],
    actions: [
      { icon: Users, text: 'Titulares — gestionar propietarios del ganado' },
      { icon: Building2, text: 'Establecimientos — gestionar predios con RUP' },
      { icon: Dna, text: 'Razas — catálogo de razas bovinas' },
      { icon: Lock, text: 'Contraseña — cambiar clave de acceso' },
      { icon: Bell, text: 'Alertas — configurar notificaciones' },
    ],
    tips: [
      'El RUP (Rol Único Pecuario) es el identificador oficial de cada predio ante el SAG',
      'Configura titular y establecimientos antes de registrar animales',
      'Puedes tener múltiples establecimientos bajo un mismo titular',
      'Las razas se organizan por especie (Bovino, Ovino, etc.)',
    ],
  },
];

export default function AyudaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = modules.filter((mod) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      mod.name.toLowerCase().includes(term) ||
      mod.shortDesc.toLowerCase().includes(term) ||
      mod.whatIs.toLowerCase().includes(term) ||
      mod.howTo.some((step) => step.toLowerCase().includes(term)) ||
      mod.actions.some((a) => a.text.toLowerCase().includes(term)) ||
      mod.tips.some((tip) => tip.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="h-7 w-7 text-primary" />
            Centro de Ayuda
          </h1>
          <p className="text-muted-foreground mt-1">
            Aprende a usar cada módulo de Mi Ganado de forma fácil y rápida
          </p>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en la ayuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {modules.map((mod) => (
          <a
            key={mod.id}
            href={`#${mod.id}`}
            className="group"
            onClick={(e) => {
              e.preventDefault();
              setSearchTerm('');
              const el = document.getElementById(mod.id);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Open the accordion item
                const trigger = el.querySelector('[data-state]');
                if (trigger && trigger.getAttribute('data-state') === 'closed') {
                  (trigger as HTMLElement).click();
                }
              }
            }}
          >
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
              <CardContent className="pt-4 pb-3 flex flex-col items-center text-center gap-2">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${mod.color}`}>
                  <mod.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{mod.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {mod.shortDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <Separator />

      {/* Detailed Guides */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No se encontraron resultados para &quot;{searchTerm}&quot;</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {filteredModules.map((mod) => (
            <AccordionItem
              key={mod.id}
              value={mod.id}
              id={mod.id}
              className="border rounded-lg px-4 data-[state=open]:bg-muted/20"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${mod.color}`}>
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">{mod.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">
                      {mod.shortDesc}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-5 pt-2">
                  {/* What is it */}
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      ¿Qué es?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mod.whatIs}
                    </p>
                  </div>

                  <Separator />

                  {/* How to use */}
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <ListOrdered className="h-4 w-4 text-primary" />
                      ¿Cómo se usa?
                    </h3>
                    <ol className="space-y-2">
                      {mod.howTo.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Separator />

                  {/* Available actions */}
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-primary" />
                      Acciones disponibles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mod.actions.map((action, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
                        >
                          <action.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{action.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Tips */}
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Consejos
                    </h3>
                    <div className="space-y-2">
                      {mod.tips.map((tip, i) => (
                        <Alert key={i} className="border-yellow-200 bg-yellow-50/50">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-sm">
                            {tip}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>

                  {/* Link to module */}
                  <div className="pt-2">
                    <Link
                      href={mod.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Ir a {mod.name}
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Footer help */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">¿Necesitas más ayuda?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Si tienes dudas adicionales sobre el uso de la aplicación, contacta al administrador del sistema o revisa la documentación técnica del proyecto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
