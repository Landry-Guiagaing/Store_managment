'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../application/useProducts';
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../application/useProductMutations';
import { ProductForm, type ProductFormData } from './ProductForm';
import { ProductFiltersBar } from './ProductFiltersBar';
import { useProductFilters } from '../application/useProductFilters';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { Product } from '../domain/Product';

export function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { canWriteProducts, canDeleteProducts } = usePermissions();

  const {
    filters,
    filtered,
    setSearch,
    setCategoriaId,
    setLowStockOnly,
    toggleSort,
    reset,
  } = useProductFilters(products);

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = (data: ProductFormData) => {
    createMutation.mutate(
      {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        quantidade: data.quantidade,
        categoriaId: data.categoriaId,
        fornecedorId: data.fornecedorId,
      },
      { onSuccess: () => setCreating(false) }
    );
  };

  const handleUpdate = (data: ProductFormData) => {
    if (!editing) return;
    updateMutation.mutate(
      {
        id: editing.id,
        data: {
          nome: data.nome,
          descricao: data.descricao,
          preco: data.preco,
          quantidade: data.quantidade,
          categoriaId: data.categoriaId,
          fornecedorId: data.fornecedorId,
        },
      },
      { onSuccess: () => setEditing(null) }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      deleteMutation.mutate(id);
    }
  };

  const sortIndicator = (field: 'nome' | 'preco' | 'quantidade') => {
    if (filters.sortField !== field) return '';
    return filters.sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const stockBadge = (q: number) => {
    if (q === 0) return <Badge variant="danger">Rupture</Badge>;
    if (q < 5) return <Badge variant="warning">Bas ({q})</Badge>;
    return <span className="text-sm text-slate-700">{q}</span>;
  };

  if (isLoading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur de chargement</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''}
          {products && filtered.length !== products.length && ` sur ${products.length}`}
        </p>
        {canWriteProducts && (
          <Button onClick={() => { setCreating(true); setEditing(null); }}>
            + Nouveau produit
          </Button>
        )}
      </div>

      <ProductFiltersBar
        filters={filters}
        onSearch={setSearch}
        onCategoria={setCategoriaId}
        onLowStock={setLowStockOnly}
        onReset={reset}
      />

      {creating && canWriteProducts && (
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && canWriteProducts && (
        <ProductForm
          initial={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Aucun produit"
            description="Aucun produit ne correspond à vos filtres."
          />
        </Card>
      ) : (
        <Card padding="sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-orange-600" onClick={() => toggleSort('nome')}>
                  Nom{sortIndicator('nome')}
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-orange-600" onClick={() => toggleSort('preco')}>
                  Prix{sortIndicator('preco')}
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-orange-600" onClick={() => toggleSort('quantidade')}>
                  Stock{sortIndicator('quantidade')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fournisseur</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.nome}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-700">{p.preco.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-center">{stockBadge(p.quantidade)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.categoriaNome ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.fornecedorNome ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Voir
                      </Link>
                      {canWriteProducts && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => { setEditing(p); setCreating(false); }}
                        >
                          Modifier
                        </Button>
                      )}
                      {canDeleteProducts && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}