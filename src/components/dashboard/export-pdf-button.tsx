'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useExportPdf } from '@/hooks/use-export-pdf';

interface ExportPdfButtonProps {
  filename?: string;
  elementId?: string;
  title?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportPdfButton({
  filename = 'reporte-dashboard.pdf',
  elementId = 'dashboard-content',
  title = 'Reporte Dashboard',
  variant = 'outline',
  size = 'sm',
}: ExportPdfButtonProps) {
  const { exportToPdf } = useExportPdf();

  const handleExport = () => {
    exportToPdf({ filename, elementId, title });
  };

  return (
    <Button variant={variant} size={size} onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
}
