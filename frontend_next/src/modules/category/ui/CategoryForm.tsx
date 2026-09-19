'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import type { Category } from '../domain/Category';

export interface CategoryFormData {
  nome: string;
}

interface Props {
  initial?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function CategoryForm({ initial, onSubmit, onCancel, isPending }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: { nome: initial?.nome ?? '' },
  });

  useEffect(() => {
    reset({ nome: initial?.nome ?? '' });
  }, [initial, reset]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom"
          {...register('nome', { required: 'Nom requis' })}
          error={errors.nome?.message}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}