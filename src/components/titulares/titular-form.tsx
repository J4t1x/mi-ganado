'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Titular, TipoTitular, EstadoGeneral } from '@/types';
import { Loader2 } from 'lucide-react';

const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/;

const titularFormSchema = z.object({
  rut: z
    .string()
    .min(1, 'El RUT es requerido')
    .regex(rutRegex, 'Formato de RUT inválido (ej: 12.345.678-9)'),
  nombreRazonSocial: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
  tipo: z.enum([TipoTitular.PERSONA_NATURAL, TipoTitular.EMPRESA], {
    message: 'Seleccione un tipo de titular',
  }),
  contacto: z.string().optional(),
  estado: z.enum([EstadoGeneral.ACTIVO, EstadoGeneral.INACTIVO]).optional(),
});

type TitularFormValues = z.infer<typeof titularFormSchema>;

interface TitularFormProps {
  titular?: Titular;
  onSubmit: (data: TitularFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TitularForm({
  titular,
  onSubmit,
  onCancel,
  isLoading = false,
}: TitularFormProps) {
  const isEditing = !!titular;

  const form = useForm<TitularFormValues>({
    resolver: zodResolver(titularFormSchema),
    defaultValues: {
      rut: titular?.rut || '',
      nombreRazonSocial: titular?.nombreRazonSocial || '',
      tipo: titular?.tipo || TipoTitular.PERSONA_NATURAL,
      contacto: titular?.contacto || '',
      estado: titular?.estado || EstadoGeneral.ACTIVO,
    },
  });

  const handleSubmit = async (data: TitularFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12.345.678-9"
                    {...field}
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Titular *</FormLabel>
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
                    <SelectItem value={TipoTitular.PERSONA_NATURAL}>
                      Persona Natural
                    </SelectItem>
                    <SelectItem value={TipoTitular.EMPRESA}>
                      Empresa
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nombreRazonSocial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese nombre o razón social"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email, teléfono u otra información de contacto"
                  className="w-full"
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
                    <SelectTrigger className="w-full">
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
            {isEditing ? 'Guardar Cambios' : 'Crear Titular'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
