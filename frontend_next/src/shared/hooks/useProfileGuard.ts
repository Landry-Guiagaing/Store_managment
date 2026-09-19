'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, Profile } from '@/shared/infrastructure/useProfileStore';

/**
 * Redirige vers '/' si aucun profil n'est choisi,
 * ou vers le bon espace si le profil ne correspond pas.
 */
export function useProfileGuard(expected: Profile) {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const hasHydrated = useProfileStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (profile === null) {
      router.replace('/');
    } else if (profile !== expected) {
      router.replace(profile === 'admin' ? '/admin/dashboard' : '/client');
    }
  }, [hasHydrated, profile, expected, router]);

  return { isHydrated: hasHydrated, profile };
}