'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type PeriodoTiempo = '1m' | '3m' | '6m' | '1y' | 'all';

interface FiltrosTemporalesProps {
  periodo: PeriodoTiempo;
  onChange: (periodo: PeriodoTiempo) => void;
  className?: string;
}

export function FiltrosTemporales({ periodo, onChange, className }: FiltrosTemporalesProps) {
  return (
    <Select value={periodo} onValueChange={(value) => onChange(value as PeriodoTiempo)}>
      <SelectTrigger className={`w-[120px] ${className}`}>
        <SelectValue placeholder="Periodo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1m">Último mes</SelectItem>
        <SelectItem value="3m">3 meses</SelectItem>
        <SelectItem value="6m">6 meses</SelectItem>
        <SelectItem value="1y">Último año</SelectItem>
        <SelectItem value="all">Todo</SelectItem>
      </SelectContent>
    </Select>
  );
}

// Función de utilidad para filtrar datos por periodo
export function filtrarPorPeriodo<T extends { fecha: string }>(datos: T[], periodo: PeriodoTiempo): T[] {
  if (periodo === 'all') return datos;
  
  const hoy = new Date();
  const fechaLimite = new Date();
  
  switch (periodo) {
    case '1m':
      fechaLimite.setMonth(hoy.getMonth() - 1);
      break;
    case '3m':
      fechaLimite.setMonth(hoy.getMonth() - 3);
      break;
    case '6m':
      fechaLimite.setMonth(hoy.getMonth() - 6);
      break;
    case '1y':
      fechaLimite.setFullYear(hoy.getFullYear() - 1);
      break;
    default:
      fechaLimite.setMonth(hoy.getMonth() - 6); // Default a 6 meses
  }
  
  return datos.filter(item => new Date(item.fecha) >= fechaLimite);
}

// Función para obtener el texto descriptivo del periodo
export function getDescripcionPeriodo(periodo: PeriodoTiempo): string {
  switch (periodo) {
    case '1m':
      return 'último mes';
    case '3m':
      return 'últimos 3 meses';
    case '6m':
      return 'últimos 6 meses';
    case '1y':
      return 'último año';
    case 'all':
      return 'todo el periodo';
    default:
      return 'periodo seleccionado';
  }
}
