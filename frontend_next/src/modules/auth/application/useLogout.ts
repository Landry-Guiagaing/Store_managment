'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from './useAuthStore';

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return () => {
    logout();
    router.push('/login');
  };
}