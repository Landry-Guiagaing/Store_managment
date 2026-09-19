'use client';

import { useState } from 'react';
import { useSuppliers } from '../application/useSuppliers';
import {
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from '../application/useSupplierMutations';
import { SupplierForm, type SupplierFormData } from './SupplierForm';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Supplier } from '../domain/Supplier';

export function SupplierList() {
  const { data: suppliers, isLoading, error } = useSuppliers();
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();
  const { canWriteSuppliers, canDeleteSuppliers } = usePermissions();

  const [editing, setEditing] = useState<Supplier | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = (data: SupplierFormData) => {
    createMutation.mutate(data, { onSuccess: () => setCreating(false) });
  };

  const handleUpdate = (data: SupplierFormData) => {
    if (!editing) return;
    updateMutation.mutate(
      { id: editing.id, data },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce fournisseur ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur de chargement</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {canWriteSuppliers && (
          <Button onClick={() => { setCreating(true); setEditing(null); }}>
            + Nouveau fournisseur
          </Button>
        )}
      </div>

      {creating && canWriteSuppliers && (
        <SupplierForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && canWriteSuppliers && (
        <SupplierForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {suppliers && suppliers.length === 0 ? (
        <Card>
          <EmptyState
            title="Aucun fournisseur"
            description="Ajoutez vos fournisseurs pour les associer aux produits."
          />
        </Card>
      ) : (
        <Card padding="sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">CNPJ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Téléphone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                {(canWriteSuppliers || canDeleteSuppliers) && (
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {suppliers?.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">{s.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{s.nome}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.cnpj ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.telefone ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.email ?? '—'}</td>
                  {(canWriteSuppliers || canDeleteSuppliers) && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {canWriteSuppliers && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => { setEditing(s); setCreating(false); }}
                          >
                            Modifier
                          </Button>
                        )}
                        {canDeleteSuppliers && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(s.id)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}