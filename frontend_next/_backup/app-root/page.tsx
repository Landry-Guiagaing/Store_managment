'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/shared/infrastructure/useProfileStore';

export default function ProfileSelectionPage() {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  // Si un profil existe déjà, rediriger automatiquement
  useEffect(() => {
    if (profile === 'client') router.replace('/client');
    if (profile === 'admin') router.replace('/admin/dashboard');
  }, [profile, router]);

  const handleChoice = (choice: 'client' | 'admin') => {
    setProfile(choice);
    router.push(choice === 'client' ? '/client' : '/admin/dashboard');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">🛒 E-Shop</h1>
      <p className="text-gray-600 mb-12">Choisissez votre espace</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        <button
          onClick={() => handleChoice('client')}
          className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
        >
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Espace Client</h2>
          <p className="text-gray-500 text-sm">
            Parcourir le catalogue, ajouter au panier, passer commande
          </p>
        </button>

        <button
          onClick={() => handleChoice('admin')}
          className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
        >
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Espace Admin</h2>
          <p className="text-gray-500 text-sm">
            Gérer les produits, consulter les commandes et les clients
          </p>
        </button>
      </div>
    </main>
  );
}