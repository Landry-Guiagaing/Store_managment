'use client';

import Link from 'next/link';
import { useProducts } from '@/modules/product/application/useProducts';

export function RecentProducts() {
  const { data: products } = useProducts();

  const recent = [...(products ?? [])]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p className="text-gray-500">Aucun produit.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Derniers produits ajoutés</h3>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          Voir tous
        </Link>
      </div>
      <ul className="space-y-2">
        {recent.map((p) => (
          <li key={p.id} className="flex justify-between border-b pb-2 last:border-0">
            <div>
              <p className="font-medium">{p.nome}</p>
              <p className="text-xs text-gray-500">
                {p.categoriaNome ?? 'Sans catégorie'}
              </p>
            </div>
            <span className="text-sm text-gray-600">{p.preco.toFixed(2)} €</span>
          </li>
        ))}
      </ul>
    </div>
  );
}