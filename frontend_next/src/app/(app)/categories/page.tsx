'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { CategoryList } from '@/modules/category/ui/CategoryList';

export default function CategoriesPage() {
  const router = useRouter();
  const { can } = usePermissions();

  useEffect(() => {
    if (!can('categories')) router.replace('/dashboard');
  }, [can, router]);

  if (!can('categories')) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catégories</h1>
      <CategoryList />
    </div>
  );
}