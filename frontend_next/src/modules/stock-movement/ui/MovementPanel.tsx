'use client';

import { useState } from 'react';
import { useProducts } from '@/modules/product/application/useProducts';
import { MovementForm } from './MovementForm';
import { MovementHistory } from './MovementHistory';
import { useCreateMovement } from '../application/useCreateMovement';

export function MovementPanel() {
  const { data: products, isLoading } = useProducts();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const createMutation = useCreateMovement();

  if (isLoading) return <p>Chargement des produits...</p>;

  const selected = products?.find((p) => p.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Produit</label>
        <select
          value={selectedId ?? ''}
          onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
          className="w-full max-w-md border rounded px-3 py-2"
        >
          <option value="">— Sélectionner un produit —</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} (stock: {p.quantidade})
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">{selected.nome}</h2>
            <p className="text-sm text-gray-600">
              Prix : {selected.preco.toFixed(2)} € · Stock actuel :{' '}
              <strong>{selected.quantidade}</strong>
            </p>
          </div>

          <MovementForm
            produtoId={selected.id}
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />

          <div>
            <h3 className="text-lg font-semibold mb-3">Historique</h3>
            <MovementHistory produtoId={selected.id} produtoNome={selected.nome} />
          </div>
        </>
      )}
    </div>
  );
}