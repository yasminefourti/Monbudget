'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from 'lib/api';

export default function TransactionsPage() {
  const router = useRouter();
  const pathname = usePathname(); // ex: /goal/1/transactions
  const goalId = pathname.split('/')[2]; // extraire goalId de l'url

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State formulaire ajout transaction
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

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Transactions pour l'objectif #{goalId}</h1>

      <form onSubmit={handleAddTransaction}>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="recette">Recette</option>
          <option value="dépense">Dépense</option>
        </select>
        <input
          type="number"
          placeholder="Montant"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Ajouter transaction</button>
      </form>

      <ul>
        {transactions.length === 0 && <li>Aucune transaction trouvée</li>}
        {transactions.map(t => (
          <li key={t.id}>
            <b>{t.type}</b> - {t.amount} € - {new Date(t.date).toLocaleDateString()} - {t.description}
            <button onClick={() => handleDelete(t.id)} style={{ marginLeft: '10px' }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
