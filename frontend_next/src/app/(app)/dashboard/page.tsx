'use client';

import { StatsCards } from '@/modules/dashboard/ui/StatsCards';
import { LowStockAlert } from '@/modules/dashboard/ui/LowStockAlert';
import { RecentProducts } from '@/modules/dashboard/ui/RecentProducts';
import { StockEvolutionChart } from '@/modules/dashboard/ui/StockEvolutionChart';
import { CategoryBreakdownChart } from '@/modules/dashboard/ui/CategoryBreakdownChart';
import { TopProductsChart } from '@/modules/dashboard/ui/TopProductsChart';
import { useAuthStore } from '@/modules/auth/application/useAuthStore';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour, {user?.nome ?? 'utilisateur'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Vue d ensemble de votre stock</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert />
        <RecentProducts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockEvolutionChart />
        <CategoryBreakdownChart />
      </div>

      <TopProductsChart />
    </div>
  );
}