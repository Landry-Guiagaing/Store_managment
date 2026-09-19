'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/modules/auth/application/useAuthStore';
import { usePermissions } from '@/modules/auth/application/usePermissions';
import { useHydration } from '@/modules/auth/application/useHydration';
import { AppNav } from '@/shared/ui/AppNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isAdmin } = usePermissions();
  const hydrated = useHydration();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AppNav />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppNav />
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}