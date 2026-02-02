'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimalForm } from '@/components/animales/animal-form';
import { animalesService } from '@/lib/api/animales';
import { Animal, UpdateAnimalDto } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditarAnimalPage() {
  const params = useParams();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAnimal();
  }, [params.id]);

  const loadAnimal = async () => {
    try {
      const data = await animalesService.getById(params.id as string);
      setAnimal(data);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar animal');
      router.push('/dashboard/animales');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateAnimalDto) => {
    setIsSubmitting(true);
    try {
      await animalesService.update(params.id as string, data);
      toast.success('Animal actualizado exitosamente');
      router.push(`/dashboard/animales/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar animal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/animales/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!animal) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/animales/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Editar Animal</h1>
          <p className="text-muted-foreground">
            Actualiza la información del animal
          </p>
        </div>
      </div>

      <AnimalForm
        animal={animal}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </div>
  );
}
