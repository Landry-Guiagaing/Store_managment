'use client';

import { useForm } from 'react-hook-form';
import type { MovementType, CreateStockMovementData } from '../domain/StockMovement';

export interface MovementFormData {
  tipo: MovementType;
  quantidade: number;
  observacao?: string;
}

interface Props {
  produtoId: number;
  onSubmit: (data: CreateStockMovementData) => void;
  isPending?: boolean;
}

export function MovementForm({ produtoId, onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovementFormData>({
    defaultValues: {
      tipo: 'ENTRADA',
      quantidade: 1,
      observacao: '',
    },
  });

  const handleFormSubmit = (data: MovementFormData) => {
    onSubmit({
      tipo: data.tipo,
      quantidade: data.quantidade,
      observacao: data.observacao,
      produtoId,
    });
    reset({ tipo: data.tipo, quantidade: 1, observacao: '' });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            {...register('tipo', { required: 'Type requis' })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="ENTRADA">Entrée</option>
            <option value="SAIDA">Sortie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantité *</label>
          <input
            type="number"
            {...register('quantidade', {
              required: 'Quantité requise',
              valueAsNumber: true,
              min: { value: 1, message: 'Minimum 1' },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.quantidade && (
            <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observation</label>
          <input
            {...register('observacao')}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isPending ? 'Enregistrement...' : 'Enregistrer le mouvement'}
      </button>
    </form>
  );
}