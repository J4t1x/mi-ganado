'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useOfflineStore } from '@/stores/offline-store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  User,
  LogOut,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  Beef,
  Home,
  Package,
  Scale,
  ArrowRightLeft,
  BarChart3,
  Syringe,
  DollarSign,
  Building2,
  Users,
  Dna,
  Lock,
  HelpCircle,
} from 'lucide-react';

const mobileNavigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Ganado', href: '/dashboard/animales', icon: Beef },
  { name: 'Lotes', href: '/dashboard/lotes', icon: Package },
  { name: 'Pesajes', href: '/dashboard/pesajes', icon: Scale },
  { name: 'Movimientos', href: '/dashboard/movimientos', icon: ArrowRightLeft },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  { name: 'Sanitario', href: '/dashboard/sanitario', icon: Syringe },
  { name: 'Financiero', href: '/dashboard/financiero', icon: DollarSign },
];

const mobileSecondaryNavigation = [
  { name: 'Establecimientos', href: '/dashboard/configuracion/establecimientos', icon: Building2 },
  { name: 'Titulares', href: '/dashboard/configuracion/titulares', icon: Users },
  { name: 'Razas', href: '/dashboard/configuracion/razas', icon: Dna },
  { name: 'Contraseña', href: '/dashboard/configuracion/cambiar-password', icon: Lock },
  { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { isOnline, pendingSync } = useOfflineStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Close sheet on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden -m-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="md:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Beef className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Mi Ganado</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {mounted && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-muted rounded-md">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm hidden sm:inline">Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-accent" />
                  <span className="text-sm hidden sm:inline">Offline</span>
                </>
              )}
              {pendingSync > 0 && (
                <Badge variant="outline" className="ml-1">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {pendingSync}
                </Badge>
              )}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracion">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ayuda">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ayuda
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Beef className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg">Mi Ganado</SheetTitle>
                <SheetDescription className="text-xs">Gestión Ganadera</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {mobileNavigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administración
              </p>
              <div className="space-y-1">
                {mobileSecondaryNavigation.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/dashboard/configuracion' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/dashboard/ayuda"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname === '/dashboard/ayuda'
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                Ayuda
              </Link>
            </div>
          </nav>

          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-destructive hover:text-destructive"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
