'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Beef } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Beef className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Instalar Mi Ganado</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Accede más rápido y trabaja sin conexión
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleInstall}>
                  <Download className="h-3 w-3 mr-1" />
                  Instalar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  Ahora no
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={handleDismiss}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
