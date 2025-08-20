'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from 'lib/api';

export default function TransactionsPage() {
  const params = useParams();
  const goalId = params.id;

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
        setTransactions(res.data || []);
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
      await api.delete(`/budget/goals/${goalId}/transactions/${id}`);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  }

  if (loading) return <p className="text-white text-xl text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          Transactions pour l’objectif <span className="text-black">#{goalId}</span>
        </h1>

        {/* Formulaire */}
        <form
          onSubmit={handleAddTransaction}
          className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full p-3 rounded-lg border"
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
              className="w-full p-3 rounded-lg border"
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full p-3 rounded-lg border"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border"
            />
          </div>
          <button
            type="submit"
            className=" w-full bg-teal-600 hover:bg-teal-700 text-white px-3 py-2  rounded-lg font-semibold"
          >
            Ajouter une transaction
          </button>
        </form>

        {/* Liste des transactions */}
        <h2 className="text-2xl font-semibold mb-4 text-black">Liste des transactions</h2>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-white/90">Aucune transaction trouvée.</p>
          ) : (
            transactions.map(t => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
              >
                <div>
                  <span className="font-bold capitalize">{t.type}</span> - {t.amount} €
                  <span className="ml-2 text-gray-500">
                    ({new Date(t.date).toLocaleDateString()})
                  </span>
                  <div className="text-gray-600 text-sm">{t.description}</div>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
