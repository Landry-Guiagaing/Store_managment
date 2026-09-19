'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useProducts } from '@/modules/product/application/useProducts';

export function TopProductsChart() {
  const { data: products } = useProducts();

  const data = useMemo(() => {
    if (!products) return [];
    return [...products]
      .map((p) => ({
        name: p.nome.length > 15 ? p.nome.slice(0, 15) + '…' : p.nome,
        value: Number((p.preco * p.quantidade).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [products]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Top 5 produits (valeur du stock)</h3>
        <p className="text-gray-500 text-sm">Aucun produit.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Top 5 produits (valeur du stock)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" fontSize={12} />
          <YAxis type="category" dataKey="name" fontSize={12} width={120} />
          <Tooltip formatter={(v) => `${Number(v).toFixed(2)} €`} />
          <Bar dataKey="value" fill="#ea580c" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}