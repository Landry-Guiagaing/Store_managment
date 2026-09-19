'use client';

import Link from 'next/link';
import { useProducts } from '@/modules/product/application/useProducts';

export function LowStockAlert() {
  const { data: products } = useProducts();
  const lowStock = products?.filter((p) => p.quantidade < 5) ?? [];

  if (lowStock.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded">
        <p className="text-green-800 font-medium">
          ✅ Aucun produit en alerte de stock
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-red-600">
          ⚠️ {lowStock.length} produit(s) en stock bas
        </h3>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          Voir tous
        </Link>
      </div>
      <ul className="space-y-2">
        {lowStock.slice(0, 5).map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center border-b pb-2 last:border-0"
          >
            <span>{p.nome}</span>
            <span
              className={
                p.quantidade === 0
                  ? 'text-red-600 font-bold'
                  : 'text-orange-500 font-semibold'
              }
            >
              {p.quantidade} en stock
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}