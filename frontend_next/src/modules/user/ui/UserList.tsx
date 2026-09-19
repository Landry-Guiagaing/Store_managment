'use client';

import { useUsers } from '../application/useUsers';
import {
  useDeleteUser,
  useToggleUserActif,
} from '../application/useUserMutations';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const deleteMutation = useDeleteUser();
  const toggleMutation = useToggleUserActif();

  const handleDelete = (id: number) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (id: number) => {
    toggleMutation.mutate(id);
  };

  if (isLoading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur de chargement</p>;

  return (
    <div className="space-y-4">
      {users && users.length === 0 ? (
        <Card>
          <EmptyState title="Aucun utilisateur" />
        </Card>
      ) : (
        <Card padding="sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Username</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nom</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rôle</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-600">{u.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{u.nome}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info">{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.actif ? (
                      <Badge variant="success">Actif</Badge>
                    ) : (
                      <Badge variant="danger">Inactif</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleToggle(u.id)}
                        disabled={toggleMutation.isPending}
                      >
                        {u.actif ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(u.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}