'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, Beef } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <WifiOff className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sin Conexión</CardTitle>
          <CardDescription>
            No tienes conexión a internet. Algunas funciones pueden no estar disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Los datos que hayas consultado recientemente estarán disponibles en caché.
            Las operaciones pendientes se sincronizarán automáticamente cuando vuelvas a conectarte.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar conexión
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <Beef className="h-4 w-4 mr-2" />
                Ir al Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
