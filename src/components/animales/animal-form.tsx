'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CreateAnimalDto,
  Especie,
  Sexo,
  TipoIdentificador,
  Animal,
} from '@/types';
import { titularesService } from '@/lib/api/titulares';
import { establecimientosService } from '@/lib/api/establecimientos';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const animalSchema = z.object({
  especie: z.nativeEnum(Especie).default(Especie.BOVINO),
  sexo: z.nativeEnum(Sexo).optional(),
  fechaNacimiento: z.string().optional(),
  titularActualId: z.string().optional(),
  establecimientoActualId: z.string().optional(),
  loteId: z.string().optional(),
});

const identificadorSchema = z.object({
  tipo: z.nativeEnum(TipoIdentificador),
  codigo: z.string().min(1, 'El código es requerido'),
  fechaAsignacion: z.string().optional(),
});

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (data: CreateAnimalDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AnimalForm({ animal, onSubmit, onCancel, isLoading }: AnimalFormProps) {
  const [titulares, setTitulares] = useState<any[]>([]);
  const [establecimientos, setEstablecimientos] = useState<any[]>([]);
  const [identificadores, setIdentificadores] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAnimalDto>({
    resolver: zodResolver(animalSchema),
    defaultValues: animal || {
      especie: Especie.BOVINO,
    },
  });

  const selectedTitularId = watch('titularActualId');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTitularId) {
      loadEstablecimientos(selectedTitularId);
    } else {
      setEstablecimientos([]);
    }
  }, [selectedTitularId]);

  const loadInitialData = async () => {
    try {
      const titularesRes = await titularesService.getAll({ limit: 100 });
      setTitulares(titularesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadEstablecimientos = async (titularId: string) => {
    try {
      const res = await establecimientosService.getAll({ titularId, limit: '100' });
      setEstablecimientos(res.data || []);
    } catch (error) {
      console.error('Error loading establecimientos:', error);
    }
  };

  const addIdentificador = () => {
    setIdentificadores([
      ...identificadores,
      { tipo: TipoIdentificador.DIIO_VISUAL, codigo: '', fechaAsignacion: new Date().toISOString().split('T')[0] },
    ]);
  };

  const removeIdentificador = (index: number) => {
    setIdentificadores(identificadores.filter((_, i) => i !== index));
  };

  const updateIdentificador = (index: number, field: string, value: any) => {
    const updated = [...identificadores];
    updated[index] = { ...updated[index], [field]: value };
    setIdentificadores(updated);
  };

  const handleFormSubmit = async (data: CreateAnimalDto) => {
    // Clean up data: remove empty strings and convert to undefined
    const submitData: CreateAnimalDto = {
      especie: data.especie,
      sexo: data.sexo,
      fechaNacimiento: data.fechaNacimiento && data.fechaNacimiento.trim() !== '' 
        ? data.fechaNacimiento 
        : undefined,
      titularActualId: data.titularActualId,
      establecimientoActualId: data.establecimientoActualId,
      loteId: data.loteId,
      identificadores: identificadores.length > 0 
        ? identificadores.map(id => ({
            tipo: id.tipo,
            codigo: id.codigo,
            fechaAsignacion: id.fechaAsignacion && id.fechaAsignacion.trim() !== '' 
              ? id.fechaAsignacion 
              : undefined,
          }))
        : undefined,
    };
    
    await onSubmit(submitData);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="especie">Especie</Label>
              <Select
                value={watch('especie')}
                onValueChange={(value) => setValue('especie', value as Especie)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Especie.BOVINO}>Bovino</SelectItem>
                  <SelectItem value={Especie.OVINO}>Ovino</SelectItem>
                  <SelectItem value={Especie.CAPRINO}>Caprino</SelectItem>
                  <SelectItem value={Especie.PORCINO}>Porcino</SelectItem>
                  <SelectItem value={Especie.EQUINO}>Equino</SelectItem>
                </SelectContent>
              </Select>
              {errors.especie && (
                <p className="text-sm text-destructive">{errors.especie.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={watch('sexo')}
                onValueChange={(value) => setValue('sexo', value as Sexo)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Sexo.MACHO}>Macho</SelectItem>
                  <SelectItem value={Sexo.HEMBRA}>Hembra</SelectItem>
                </SelectContent>
              </Select>
              {errors.sexo && (
                <p className="text-sm text-destructive">{errors.sexo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                {...register('fechaNacimiento')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titularActualId">Titular</Label>
              <Select
                value={watch('titularActualId')}
                onValueChange={(value) => {
                  setValue('titularActualId', value);
                  setValue('establecimientoActualId', undefined);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar titular" />
                </SelectTrigger>
                <SelectContent>
                  {titulares.map((titular) => (
                    <SelectItem key={titular.id} value={titular.id}>
                      {titular.nombreRazonSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="establecimientoActualId">Establecimiento</Label>
              <Select
                value={watch('establecimientoActualId')}
                onValueChange={(value) => setValue('establecimientoActualId', value)}
                disabled={!selectedTitularId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar establecimiento" />
                </SelectTrigger>
                <SelectContent>
                  {establecimientos.map((est) => (
                    <SelectItem key={est.id} value={est.id}>
                      {est.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!animal && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Identificadores</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIdentificador}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {identificadores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay identificadores agregados. Haz clic en "Agregar" para añadir uno.
              </p>
            ) : (
              identificadores.map((id, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={id.tipo}
                        onValueChange={(value) =>
                          updateIdentificador(index, 'tipo', value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TipoIdentificador.DIIO_VISUAL}>
                            DIIO Visual
                          </SelectItem>
                          <SelectItem value={TipoIdentificador.RFID}>
                            RFID
                          </SelectItem>
                          <SelectItem value={TipoIdentificador.CHIP}>
                            Chip
                          </SelectItem>
                          <SelectItem value={TipoIdentificador.BOLUS}>
                            Bolus
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Código</Label>
                      <Input
                        value={id.codigo}
                        onChange={(e) =>
                          updateIdentificador(index, 'codigo', e.target.value)
                        }
                        placeholder="Ingrese código"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha de Asignación</Label>
                      <Input
                        type="date"
                        value={id.fechaAsignacion}
                        onChange={(e) =>
                          updateIdentificador(index, 'fechaAsignacion', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIdentificador(index)}
                    className="mt-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {animal ? 'Actualizar' : 'Crear'} Animal
        </Button>
      </div>
    </form>
  );
}
