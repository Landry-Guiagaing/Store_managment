'use client';

import { useStockMovements } from '../application/useStockMovements';
import { exportMovementsToCsv } from '../application/exportMovementsCsv';

interface Props {
  produtoId: number;
  produtoNome?: string;
}

export function MovementHistory({ produtoId, produtoNome = 'produit' }: Props) {
  const { data: movements, isLoading, error } = useStockMovements(produtoId);

  const handleExport = () => {
    if (!movements || movements.length === 0) return;
    exportMovementsToCsv(movements, produtoNome);
  };

  if (isLoading) return <p>Chargement de l historique...</p>;
  if (error) return <p className="text-red-500">Erreur de chargement</p>;
  if (!movements?.length) {
    return <p className="text-gray-500">Aucun mouvement.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-50"
        >
          ⬇ Exporter CSV ({movements.length})
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Type</th>
            <th className="text-right p-3">Quantité</th>
            <th className="text-left p-3">Observation</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{new Date(m.data).toLocaleString('fr-FR')}</td>
              <td className="p-3">
                <span
                  className={
                    m.tipo === 'ENTRADA'
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {m.tipo === 'ENTRADA' ? 'Entrée' : 'Sortie'}
                </span>
              </td>
              <td className="p-3 text-right">{m.quantidade}</td>
              <td className="p-3">{m.observacao ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}