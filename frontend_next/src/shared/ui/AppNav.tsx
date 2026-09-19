'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/application/useAuthStore';
import { useLogout } from '@/modules/auth/application/useLogout';
import { usePermissions, type Permission } from '@/modules/auth/application/usePermissions';
import { Badge } from './Badge';

interface NavItem {
  href: string;
  label: string;
  permission: Permission;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Tableau de bord', permission: 'dashboard' },
  { href: '/products', label: 'Produits', permission: 'products' },
  { href: '/categories', label: 'Catégories', permission: 'categories' },
  { href: '/suppliers', label: 'Fournisseurs', permission: 'suppliers' },
  { href: '/stock-movements', label: 'Mouvements', permission: 'stock-movements' },
  { href: '/users', label: 'Utilisateurs', permission: 'users' },
];

export function AppNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { can, isAdmin } = usePermissions();

  const visibleItems = NAV_ITEMS.filter((item) => can(item.permission));

  // ============================================================
  // ADMIN → SIDEBAR (noir)
  // ============================================================
  if (isAdmin) {
    return (
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-orange-500">Es</span>toque
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Gestion de stock</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-colors
                  ${active
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-white truncate">
              {user?.nome}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <div className="px-3 mb-2">
            <Badge variant="primary">{user?.role}</Badge>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </aside>
    );
  }

  // ============================================================
  // AUTRES RÔLES → NAVBAR (blanc)
  // ============================================================
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-slate-900">
            <span className="text-orange-600">Es</span>toque
          </Link>

          <nav className="flex gap-1">
            {visibleItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                    ${active
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user?.nome}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}