'use client';

import { useEffect, useState } from 'react';
import api from 'lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/budget/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Erreur chargement catégories', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nom.trim()) return alert('Le nom est requis');

    try {
      if (editingId) {
        await api.put(`/budget/categories/${editingId}`, { nom, description });
        setCategories(categories.map(cat =>
          cat.id === editingId ? { ...cat, nom, description } : cat
        ));
      } else {
        const res = await api.post('/budget/categories', { nom, description });
        setCategories([...categories, res.data]);
      }
      setNom('');
      setDescription('');
      setEditingId(null);
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
      console.error(error);
    }
  }

  function handleEdit(cat) {
    setEditingId(cat.id);
    setNom(cat.nom);
    setDescription(cat.description);
  }

  async function handleDelete(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/budget/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
      console.error(error);
    }
  }

  if (loading) return <p className="text-center mt-10 text-white">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-cyan-700">
           Gestion des Catégories
        </h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <div>
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={nom}
              onChange={e => setNom(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description (optionnelle)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-5 py-2 rounded-xl shadow hover:bg-cyan-700 transition font-medium"
            >
              {editingId ? ' Modifier' : ' Ajouter'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNom('');
                  setDescription('');
                }}
                className="bg-gray-200 px-5 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* Liste */}
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center italic">Aucune catégorie trouvée.</p>
        ) : (
          <ul className="space-y-4">
            {categories.map(cat => (
              <li
                key={cat.id}
                className="flex items-center justify-between bg-gradient-to-r from-cyan-100 text-black border rounded-xl px-5 py-4 shadow hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold">{cat.nom}</p>
                  <p className="text-sm opacity-90">{cat.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-cyan-200 px-3 py-1 rounded-lg hover:bg-white/30 transition"
                  >
                     Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-cyan-200 px-3 py-1 rounded-lg hover:bg-white/30 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
