'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Beef,
  Package,
  Scale,
  ArrowRightLeft,
  BarChart3,
  Settings,
  Home,
  Building2,
  Users,
  Dna,
  Lock,
  Syringe,
} from 'lucide-react';

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Ganado', href: '/dashboard/animales', icon: Beef },
  { name: 'Lotes', href: '/dashboard/lotes', icon: Package },
  { name: 'Pesajes', href: '/dashboard/pesajes', icon: Scale },
  { name: 'Movimientos', href: '/dashboard/movimientos', icon: ArrowRightLeft },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { name: 'Sanitario', href: '/dashboard/sanitario', icon: Syringe },
];

const secondaryNavigation = [
  { name: 'Establecimientos', href: '/dashboard/configuracion/establecimientos', icon: Building2 },
  { name: 'Titulares', href: '/dashboard/configuracion/titulares', icon: Users },
  { name: 'Razas', href: '/dashboard/configuracion/razas', icon: Dna },
  { name: 'Contraseña', href: '/dashboard/configuracion/cambiar-password', icon: Lock },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-sidebar border-r border-sidebar-border overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Beef className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">Mi Ganado</h1>
              <p className="text-xs text-muted-foreground">Gestión Ganadera</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-6">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administración
            </p>
            <div className="mt-2 space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard/configuracion' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
