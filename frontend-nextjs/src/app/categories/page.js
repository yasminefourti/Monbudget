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

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Gestion des Catégories</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Description (optionnelle)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
          >
            {editingId ? 'Modifier' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNom('');
                setDescription('');
              }}
              className="bg-gray-300 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune catégorie trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map(cat => (
            <li
              key={cat.id}
              className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 shadow-sm"
            >
              <div>
                <p className="font-semibold text-purple-700">{cat.nom}</p>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:underline"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
