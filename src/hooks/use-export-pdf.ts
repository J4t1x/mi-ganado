import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  title?: string;
}

export function useExportPdf() {
  const exportToPdf = useCallback(async (options: ExportPdfOptions = {}) => {
    const {
      filename = 'reporte-dashboard.pdf',
      elementId = 'dashboard-content',
      title = 'Reporte Dashboard',
    } = options;

    try {
      toast.loading('Generando PDF...');
      
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento no encontrado para exportar');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toLocaleDateString('es-CL').replace(/\//g, '-');
      const finalFilename = `${filename.replace('.pdf', '')}_${timestamp}.pdf`;
      
      pdf.save(finalFilename);
      
      toast.dismiss();
      toast.success('PDF generado exitosamente');
    } catch (error) {
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : 'Error al generar PDF';
      toast.error(errorMessage);
      console.error('Error exportando PDF:', error);
    }
  }, []);

  return { exportToPdf };
}
