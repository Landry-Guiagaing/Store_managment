'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useProducts } from '@/modules/product/application/useProducts';
import { useStockMovements } from '@/modules/stock-movement/application/useStockMovements';

export function StockEvolutionChart() {
  const { data: products } = useProducts();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Sélectionne automatiquement le premier produit s'il n'y en a pas
  const currentId = selectedId ?? products?.[0]?.id ?? 0;
  const { data: movements } = useStockMovements(currentId);

  /**
   * On reconstruit l'évolution du stock :
   * - On part du stock actuel du produit
   * - On remonte les mouvements dans l'ordre inverse pour déduire
   *   le stock à chaque instant passé
   */
  const chartData = useMemo(() => {
    if (!movements || !products) return [];
    const product = products.find((p) => p.id === currentId);
    if (!product) return [];

    // Trie par date croissante
    const sorted = [...movements].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );

    // Calcule le stock initial (avant le premier mouvement)
    let stock = product.quantidade;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const m = sorted[i];
      stock += m.tipo === 'ENTRADA' ? -m.quantidade : m.quantidade;
    }

    // Rejoue les mouvements en avançant
    const data: { date: string; stock: number }[] = [
      {
        date: new Date(sorted[0]?.data ?? new Date().toISOString()).toLocaleDateString('fr-FR'),
        stock,
      },
    ];

    for (const m of sorted) {
      stock += m.tipo === 'ENTRADA' ? m.quantidade : -m.quantidade;
      data.push({
        date: new Date(m.data).toLocaleDateString('fr-FR'),
        stock,
      });
    }

    return data;
  }, [movements, products, currentId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Évolution du stock</h3>
        <select
          value={currentId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="border rounded px-3 py-1 text-sm"
        >
          {products?.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      {chartData.length < 2 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          Pas assez de mouvements pour tracer une courbe.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#ea580c"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}