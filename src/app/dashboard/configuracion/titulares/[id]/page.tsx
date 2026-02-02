'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TitularDetail, TitularForm } from '@/components/titulares';
import { titularesService } from '@/lib/api/titulares';
import { TitularWithEstablecimientos, UpdateTitularDto } from '@/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface TitularDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TitularDetailPage({ params }: TitularDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [titular, setTitular] = useState<TitularWithEstablecimientos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTitular = async () => {
      setIsLoading(true);
      try {
        const data = await titularesService.getById(id);
        setTitular(data);
      } catch (error) {
        console.error('Error fetching titular:', error);
        toast.error('Error al cargar el titular');
        router.push('/dashboard/configuracion/titulares');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTitular();
  }, [id, router]);

  const handleEdit = () => {
    setDialogOpen(true);
  };

  const handleSubmit = async (data: UpdateTitularDto) => {
    setIsSubmitting(true);
    try {
      const updated = await titularesService.update(id, data);
      setTitular((prev) => (prev ? { ...prev, ...updated } : null));
      toast.success('Titular actualizado correctamente');
      setDialogOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar el titular';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!titular) {
    return null;
  }

  return (
    <>
      <TitularDetail titular={titular} onEdit={handleEdit} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Titular</DialogTitle>
          </DialogHeader>
          <TitularForm
            titular={titular}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
