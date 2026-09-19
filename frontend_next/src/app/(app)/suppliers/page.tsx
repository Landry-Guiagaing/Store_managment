'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { SupplierList } from '@/modules/supplier/ui/SupplierList';

export default function SuppliersPage() {
  const router = useRouter();
  const { can } = usePermissions();

  useEffect(() => {
    if (!can('suppliers')) router.replace('/dashboard');
  }, [can, router]);

  if (!can('suppliers')) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fournisseurs</h1>
      <SupplierList />
    </div>
  );
}