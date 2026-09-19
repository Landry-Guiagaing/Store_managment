'use client';

import type { ProductFilters } from '../application/useProductFilters';
import { useCategories } from '@/modules/category/application/useCategories';

interface Props {
  filters: ProductFilters;
  onSearch: (v: string) => void;
  onCategoria: (v: number | null) => void;
  onLowStock: (v: boolean) => void;
  onReset: () => void;
}

export function ProductFiltersBar({
  filters,
  onSearch,
  onCategoria,
  onLowStock,
  onReset,
}: Props) {
  const { data: categories, isLoading, error } = useCategories();

  // Debug visuel (à retirer après)
  console.log('categories:', categories, 'loading:', isLoading, 'error:', error);

  return (
    <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Recherche</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Nom du produit..."
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="min-w-[180px]">
        <label className="block text-sm font-medium mb-1">
          Catégorie {categories ? `(${categories.length})` : ''}
        </label>
        <select
          value={filters.categoriaId ?? ''}
          onChange={(e) =>
            onCategoria(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Toutes</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        {isLoading && <p className="text-xs text-gray-400 mt-1">Chargement...</p>}
        {error && <p className="text-xs text-red-500 mt-1">Erreur de chargement</p>}
      </div>

      <label className="flex items-center gap-2 pb-2">
        <input
          type="checkbox"
          checked={filters.lowStockOnly}
          onChange={(e) => onLowStock(e.target.checked)}
        />
        <span className="text-sm">Stock bas uniquement</span>
      </label>

      <button
        onClick={onReset}
        className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
      >
        Réinitialiser
      </button>
    </div>
  );
}