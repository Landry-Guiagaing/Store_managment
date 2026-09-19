'use client';

import Link from 'next/link';
import { useAuthStore } from '@/modules/auth/application/useAuthStore';
import { useLogout } from '@/modules/auth/application/useLogout';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useLogout();

  return (
    <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-lg font-bold">
        Estoque
      </Link>

      {isAuthenticated && user && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300">
            {user.nome}{' '}
            <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-1">
              {user.role}
            </span>
          </span>
          <button
            onClick={logout}
            className="text-gray-300 hover:text-white transition"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}