'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from 'lib/api';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/register', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        role: ['ROLE_USER'], // par défaut utilisateur
      });

      setMessage(res.data.message || 'Inscription réussie');
      
      // rediriger vers login après 2s
      setTimeout(() => router.push('/login'), 2000);

    } catch (err) {
      setError("Erreur lors de l'inscription");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600">
      <div className="bg-cyan-50 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-black">
        <h2 className="text-3xl font-bold text-center mb-6">Créer un compte</h2>

        {message && (
          <div className=" text-green-200 p-3 mb-4 rounded-md text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 mb-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Prénom</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Nom</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 "
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 transition font-semibold shadow-lg text-white"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Déjà un compte ?{' '}
          <a href="/login" className="text-black">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
