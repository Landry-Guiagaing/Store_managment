'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { UserList } from '@/modules/user/ui/UserList';

export default function UsersPage() {
  const router = useRouter();
  const { can } = usePermissions();

  useEffect(() => {
    if (!can('users')) router.replace('/dashboard');
  }, [can, router]);

  if (!can('users')) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>
      <UserList />
    </div>
  );
}