'use client';

import { useState } from 'react';
import { useCategories } from '../application/useCategories';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../application/useCategoryMutations';
import { CategoryForm, type CategoryFormData } from './CategoryForm';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Category } from '../domain/Category';

export function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const { canWriteCategories, canDeleteCategories } = usePermissions();

  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = (data: CategoryFormData) => {
    createMutation.mutate(data, { onSuccess: () => setCreating(false) });
  };

  const handleUpdate = (data: CategoryFormData) => {
    if (!editing) return;
    updateMutation.mutate(
      { id: editing.id, data },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette catégorie ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur de chargement</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {canWriteCategories && (
          <Button onClick={() => { setCreating(true); setEditing(null); }}>
            + Nouvelle catégorie
          </Button>
        )}
      </div>

      {creating && canWriteCategories && (
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && canWriteCategories && (
        <CategoryForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {categories && categories.length === 0 ? (
        <Card>
          <EmptyState
            title="Aucune catégorie"
            description="Commencez par créer une catégorie pour organiser vos produits."
          />
        </Card>
      ) : (
        <Card padding="sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nom
                </th>
                {(canWriteCategories || canDeleteCategories) && (
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {categories?.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">{c.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {c.nome}
                  </td>
                  {(canWriteCategories || canDeleteCategories) && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {canWriteCategories && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => { setEditing(c); setCreating(false); }}
                          >
                            Modifier
                          </Button>
                        )}
                        {canDeleteCategories && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(c.id)}
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