'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useOfflineStore } from '@/stores/offline-store';
import { Button } from '@/components/ui/button';
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
  X,
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
} from 'lucide-react';

const mobileNavigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Ganado', href: '/dashboard/animales', icon: Beef },
  { name: 'Lotes', href: '/dashboard/lotes', icon: Package },
  { name: 'Pesajes', href: '/dashboard/pesajes', icon: Scale },
  { name: 'Movimientos', href: '/dashboard/movimientos', icon: ArrowRightLeft },
  { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
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

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          <div className="md:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Beef className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Mi Ganado</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 py-3">
            {mobileNavigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
