'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import type { Supplier } from '../domain/Supplier';

export interface SupplierFormData {
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
}

interface Props {
  initial?: Supplier;
  onSubmit: (data: SupplierFormData) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function SupplierForm({ initial, onSubmit, onCancel, isPending }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    defaultValues: {
      nome: initial?.nome ?? '',
      cnpj: initial?.cnpj ?? '',
      telefone: initial?.telefone ?? '',
      email: initial?.email ?? '',
    },
  });

  useEffect(() => {
    reset({
      nome: initial?.nome ?? '',
      cnpj: initial?.cnpj ?? '',
      telefone: initial?.telefone ?? '',
      email: initial?.email ?? '',
    });
  }, [initial, reset]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom *"
          {...register('nome', { required: 'Nom requis' })}
          error={errors.nome?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="CNPJ" {...register('cnpj')} />
          <Input label="Téléphone" {...register('telefone')} />
          <Input
            label="Email"
            type="email"
            {...register('email', {
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Email invalide',
              },
            })}
            error={errors.email?.message}
          />
        </div>

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