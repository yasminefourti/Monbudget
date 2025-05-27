'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from 'lib/api';
import DashboardPage from 'components/dashboardPage';

export default function TransactionsPage() {
  const router = useRouter();
  const pathname = usePathname(); // ex: /goal/1/transactions
  const goalId = pathname.split('/')[2];

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState('recette');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!goalId) return;

    async function fetchTransactions() {
      try {
        const res = await api.get(`/budget/goals/${goalId}/transactions`);
        setTransactions(res.data);
      } catch (error) {
        console.error('Erreur récupération transactions', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [goalId]);

  async function handleAddTransaction(e) {
    e.preventDefault();

    try {
      const res = await api.post(`/budget/goals/${goalId}/transactions`, {
        type,
        amount: Number(amount),
        date,
        description,
      });
      setTransactions([...transactions, res.data]);
      setType('recette');
      setAmount('');
      setDate('');
      setDescription('');
    } catch (error) {
      alert("Erreur lors de l'ajout de la transaction");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/budget/transactions/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  }

  return (
    <DashboardPage title="Transactions">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Transactions pour l'objectif #{goalId}
          </h2>

          <form
            onSubmit={handleAddTransaction}
            className="space-y-4 mb-6 bg-gray-50 p-4 rounded-xl"
          >
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="recette">Recette</option>
              <option value="dépense">Dépense</option>
            </select>
            <input
              type="number"
              placeholder="Montant"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="p-2 border rounded block w-full"
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="p-2 border rounded block w-full"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="p-2 border rounded block w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ajouter transaction
            </button>
          </form>

          <ul className="space-y-2">
            {transactions.length === 0 && (
              <li>Aucune transaction trouvée</li>
            )}
            {transactions.map(t => (
              <li
                key={t.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <span>
                  <b>{t.type}</b> - {t.amount} € -{' '}
                  {new Date(t.date).toLocaleDateString()} - {t.description}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardPage>
  );
}
