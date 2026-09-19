'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { ProductList } from '@/modules/product/ui/ProductList';

export default function ProductsPage() {
  const router = useRouter();
  const { can } = usePermissions();

  useEffect(() => {
    if (!can('products')) router.replace('/dashboard');
  }, [can, router]);

  if (!can('products')) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Produits</h1>
      <ProductList />
    </div>
  );
}