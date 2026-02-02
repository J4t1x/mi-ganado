'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EstablecimientoWithRelations, TipoEstablecimiento, EstadoGeneral } from '@/types';
import { Loader2 } from 'lucide-react';

const establecimientoFormSchema = z.object({
  titularId: z.string().min(1, 'Debe seleccionar un titular'),
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  rolPredial: z.string().optional(),
  ubicacion: z.string().optional(),
  tipo: z.enum([TipoEstablecimiento.PROPIO, TipoEstablecimiento.SOCIO, TipoEstablecimiento.EXTERNO], {
    message: 'Seleccione un tipo de establecimiento',
  }),
  estado: z.enum([EstadoGeneral.ACTIVO, EstadoGeneral.INACTIVO]).optional(),
});

type EstablecimientoFormValues = z.infer<typeof establecimientoFormSchema>;

interface EstablecimientoFormProps {
  establecimiento?: EstablecimientoWithRelations;
  titulares: Array<{ id: string; nombreRazonSocial: string; rut: string }>;
  onSubmit: (data: EstablecimientoFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EstablecimientoForm({
  establecimiento,
  titulares,
  onSubmit,
  onCancel,
  isLoading = false,
}: EstablecimientoFormProps) {
  const isEditing = !!establecimiento;

  const form = useForm<EstablecimientoFormValues>({
    resolver: zodResolver(establecimientoFormSchema),
    defaultValues: {
      titularId: establecimiento?.titularId || '',
      nombre: establecimiento?.nombre || '',
      rolPredial: establecimiento?.rolPredial || '',
      ubicacion: establecimiento?.ubicacion || '',
      tipo: establecimiento?.tipo || TipoEstablecimiento.PROPIO,
      estado: establecimiento?.estado || EstadoGeneral.ACTIVO,
    },
  });

  const handleSubmit = async (data: EstablecimientoFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="titularId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titular *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione titular" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titulares.map((titular) => (
                    <SelectItem key={titular.id} value={titular.id}>
                      {titular.nombreRazonSocial} ({titular.rut})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Establecimiento *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TipoEstablecimiento.PROPIO}>
                    Propio
                  </SelectItem>
                  <SelectItem value={TipoEstablecimiento.SOCIO}>
                    Socio
                  </SelectItem>
                  <SelectItem value={TipoEstablecimiento.EXTERNO}>
                    Externo
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Establecimiento *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Fundo San José"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rolPredial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol Predial</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: 123-456"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={EstadoGeneral.ACTIVO}>
                        Activo
                      </SelectItem>
                      <SelectItem value={EstadoGeneral.INACTIVO}>
                        Inactivo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ej: Camino Rural Km 5, Osorno"
                  className="w-full resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Establecimiento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
