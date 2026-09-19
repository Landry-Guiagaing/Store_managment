'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { MovementPanel } from '@/modules/stock-movement/ui/MovementPanel';

export default function StockMovementsPage() {
  const router = useRouter();
  const { can } = usePermissions();

  useEffect(() => {
    if (!can('stock-movements')) router.replace('/dashboard');
  }, [can, router]);

  if (!can('stock-movements')) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mouvements de stock</h1>
      <MovementPanel />
    </div>
  );
}