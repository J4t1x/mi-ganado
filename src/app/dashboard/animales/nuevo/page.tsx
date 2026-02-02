'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimalForm } from '@/components/animales/animal-form';
import { animalesService } from '@/lib/api/animales';
import { CreateAnimalDto } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NuevoAnimalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateAnimalDto) => {
    setIsLoading(true);
    try {
      await animalesService.create(data);
      toast.success('Animal creado exitosamente');
      router.push('/dashboard/animales');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear animal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/animales');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/animales">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Nuevo Animal</h1>
          <p className="text-muted-foreground">
            Registra un nuevo animal en el sistema
          </p>
        </div>
      </div>

      <AnimalForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
