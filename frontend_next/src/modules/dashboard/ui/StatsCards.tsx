'use client';

import { useProducts } from '@/modules/product/application/useProducts';
import { useCategories } from '@/modules/category/application/useCategories';
import { useSuppliers } from '@/modules/supplier/application/useSuppliers';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'default' | 'success' | 'danger' | 'primary' | 'secondary';
}

const ACCENTS = {
  default: 'text-slate-900',
  success: 'text-green-600',
  danger: 'text-red-600',
  primary: 'text-orange-600',
  secondary: 'text-blue-600',
};

function StatCard({ label, value, accent = 'default' }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-2 tracking-tight ${ACCENTS[accent]}`}>
        {value}
      </p>
    </div>
  );
}

export function StatsCards() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: suppliers } = useSuppliers();

  const totalStockValue =
    products?.reduce((sum, p) => sum + p.preco * p.quantidade, 0) ?? 0;

  const lowStockCount = products?.filter((p) => p.quantidade < 5).length ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard label="Produits" value={products?.length ?? 0} accent="secondary" />
      <StatCard label="Catégories" value={categories?.length ?? 0} />
      <StatCard label="Fournisseurs" value={suppliers?.length ?? 0} />
      <StatCard
        label="Valeur du stock"
        value={`${totalStockValue.toFixed(2)} €`}
        accent="primary"
      />
      <StatCard
        label="Alertes stock"
        value={lowStockCount}
        accent={lowStockCount > 0 ? 'danger' : 'success'}
      />
    </div>
  );
}