import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AuthGuard } from '@/components/auth';
import { SyncManager } from '@/components/offline/sync-manager';
import { InstallPrompt } from '@/components/offline/install-prompt';
import { AlertChecker } from '@/components/notifications/alert-checker';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <SyncManager />
        <InstallPrompt />
        <AlertChecker />
        <div className="md:pl-64">
          <Header />
          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
