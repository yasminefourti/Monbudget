'use client';

import { useEffect, useState } from 'react';
import api from 'lib/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire création / modification
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Charger les catégories
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

    if (!nom.trim()) {
      alert('Le nom est requis');
      return;
    }

    try {
      if (editingId) {
        // Modifier catégorie
        await api.put(`/budget/categories/${editingId}`, { nom, description });
        setCategories(categories.map(cat => cat.id === editingId ? { ...cat, nom, description } : cat));
      } else {
        // Créer catégorie
        const res = await api.post('/budget/categories', { nom, description });
        setCategories([...categories, res.data]);
      }
      // Reset form
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

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Gestion des catégories</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">{editingId ? 'Modifier' : 'Ajouter'}</button>
        {editingId && <button type="button" onClick={() => {
          setEditingId(null);
          setNom('');
          setDescription('');
        }}>Annuler</button>}
      </form>

      {categories.length === 0 && <p>Aucune catégorie trouvée.</p>}

      <ul>
        {categories.map(cat => (
          <li key={cat.id} style={{ marginBottom: '10px' }}>
            <strong>{cat.nom}</strong> — {cat.description}
            <button style={{ marginLeft: 10 }} onClick={() => handleEdit(cat)}>Modifier</button>
            <button style={{ marginLeft: 10, color: 'red' }} onClick={() => handleDelete(cat.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
