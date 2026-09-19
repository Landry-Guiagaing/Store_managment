'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useProducts } from '@/modules/product/application/useProducts';

const COLORS = ['#ea580c', '#2563eb', '#f59e0b', '#3b82f6', '#c2410c', '#1d4ed8'];

export function CategoryBreakdownChart() {
  const { data: products } = useProducts();

  const data = useMemo(() => {
    if (!products) return [];
    const counts = new Map<string, number>();
    for (const p of products) {
      const key = p.categoriaNome ?? 'Sans catégorie';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Produits par catégorie</h3>
        <p className="text-gray-500 text-sm">Aucun produit.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Produits par catégorie</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label={(entry) => `${entry.name} (${entry.value})`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}