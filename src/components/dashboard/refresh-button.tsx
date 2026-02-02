import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  lastUpdate?: Date;
}

export function RefreshButton({ onClick, loading, lastUpdate }: RefreshButtonProps) {
  return (
    <div className="flex items-center gap-2">
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">
          Actualizado: {lastUpdate.toLocaleTimeString('es-CL')}
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={loading}
      >
        <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
        Actualizar
      </Button>
    </div>
  );
}
