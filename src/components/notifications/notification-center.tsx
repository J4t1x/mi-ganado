'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Syringe,
  Scale,
  ShoppingCart,
  ArrowRightLeft,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  useNotificationsStore,
  Notification,
  NotificationType,
  NotificationCategory,
} from '@/stores/notifications-store';
import { cn } from '@/lib/utils';

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case 'success': return CheckCircle;
    case 'warning': return AlertTriangle;
    case 'error': return AlertCircle;
    default: return Info;
  }
}

function getTypeColor(type: NotificationType) {
  switch (type) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-blue-600';
  }
}

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case 'sanitario': return Syringe;
    case 'pesajes': return Scale;
    case 'ventas': return ShoppingCart;
    case 'movimientos': return ArrowRightLeft;
    default: return Info;
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const TypeIcon = getTypeIcon(notification.type);
  const typeColor = getTypeColor(notification.type);

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        notification.read ? 'opacity-60' : 'bg-muted/50 hover:bg-muted'
      )}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <TypeIcon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', typeColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{notification.title}</p>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  );

  if (notification.href) {
    return <Link href={notification.href} onClick={() => onRead(notification.id)}>{content}</Link>;
  }
  return content;
}

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-semibold">Notificaciones</p>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllAsRead}>
                <CheckCheck className="h-3 w-3 mr-1" />
                Leer todo
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearAll}>
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="overflow-y-auto flex-1 max-h-[50vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sin notificaciones</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} onRead={markAsRead} />
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
