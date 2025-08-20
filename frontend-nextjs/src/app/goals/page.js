'use client';

import { useEffect, useState } from 'react';
import api from 'lib/api';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
  });
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    title: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/budget/goals');
      setGoals(res.data || []);
    } catch (err) {
      setError('Impossible de charger les objectifs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();

    // Vérifie si un objectif existe déjà
    if (goals.length > 0) {
      alert('Vous ne pouvez créer qu’un seul objectif.');
      return;
    }

    if (!newGoal.title.trim() || !newGoal.targetAmount) {
      alert('Le titre et le montant cible sont obligatoires');
      return;
    }
    try {
      const payload = {
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
      };
      await api.post('/budget/goals', payload);
      setNewGoal({ title: '', targetAmount: '', startDate: '', endDate: '' });
      fetchGoals();
    } catch (err) {
      alert("Erreur lors de la création de l'objectif");
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet objectif ?")) return;
    try {
      await api.delete(`/budget/goals/${id}`);
      fetchGoals();
    } catch (err) {
      alert("Erreur lors de la suppression de l'objectif");
      console.error(err);
    }
  };

  const startEditGoal = (goal) => {
    setEditGoalId(goal.id);
    setEditGoalData({
      title: goal.title || '',
      targetAmount: goal.targetAmount?.toString() || '',
      startDate: goal.startDate?.slice(0, 10) || '',
      endDate: goal.endDate?.slice(0, 10) || '',
    });
  };

  const cancelEdit = () => {
    setEditGoalId(null);
    setEditGoalData({ title: '', targetAmount: '', startDate: '', endDate: '' });
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    if (!editGoalData.title.trim() || !editGoalData.targetAmount) {
      alert('Le titre et le montant cible sont obligatoires');
      return;
    }
    try {
      const payload = {
        ...editGoalData,
        targetAmount: parseFloat(editGoalData.targetAmount),
      };
      await api.put(`/budget/goals/${editGoalId}`, payload);
      setEditGoalId(null);
      setEditGoalData({ title: '', targetAmount: '', startDate: '', endDate: '' });
      fetchGoals();
    } catch (err) {
      alert("Erreur lors de la mise à jour de l'objectif");
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Chargement de l'objectif...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-100">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-black">Mon Objectif</h1>

        {/* Formulaire création affiché seulement si aucun objectif */}
        {goals.length === 0 && (
          <form onSubmit={handleCreateGoal} className="mb-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Créer votre objectif</h2>

            <input
              type="text"
              placeholder="Titre"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />

            <input
              type="number"
              placeholder="Montant cible (€)"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              min="0"
              step="0.01"
              required
            />

            <label className="block font-medium text-sm text-gray-600">Période :</label>
            <div className="flex gap-4">
              <input
                type="date"
                value={newGoal.startDate}
                onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="date"
                value={newGoal.endDate}
                onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                className="w-1/2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
            >
              Créer
            </button>
          </form>
        )}

        {/* Liste (un seul objectif max) */}
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun objectif trouvé.</p>
        ) : (
          <ul className="space-y-4">
            {goals.map((goal) => (
              <li key={goal.id} className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                {editGoalId === goal.id ? (
                  <form onSubmit={handleEditGoal} className="space-y-3">
                    <input
                      type="text"
                      value={editGoalData.title}
                      onChange={(e) =>
                        setEditGoalData({ ...editGoalData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />

                    <input
                      type="number"
                      value={editGoalData.targetAmount}
                      onChange={(e) =>
                        setEditGoalData({ ...editGoalData, targetAmount: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      min="0"
                      step="0.01"
                      required
                    />

                    <div className="flex gap-4">
                      <input
                        type="date"
                        value={editGoalData.startDate}
                        onChange={(e) =>
                          setEditGoalData({ ...editGoalData, startDate: e.target.value })
                        }
                        className="w-1/2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        type="date"
                        value={editGoalData.endDate}
                        onChange={(e) =>
                          setEditGoalData({ ...editGoalData, endDate: e.target.value })
                        }
                        className="w-1/2 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-cyan-900">{goal.title}</h3>
                    <p>
                      <strong>Montant cible :</strong> {goal.targetAmount} €
                    </p>
                    <p>
                      <strong>Montant actuel :</strong> {goal.currentAmount ?? 0} €
                    </p>
                    <p>
                      <strong>Période :</strong> {goal.startDate?.slice(0, 10)} - {goal.endDate?.slice(0, 10)}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => startEditGoal(goal)}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
