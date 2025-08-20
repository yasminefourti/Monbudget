'use client';

import { useEffect, useState } from 'react';
import api from 'lib/api';
import withAuth from 'components/withAuth';

function ProfilePage() {
  const [profile, setProfile] = useState({
    email: '',
    firstname: '',
    lastname: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile({
          email: res.data.user.email || '',
          firstname: res.data.user.firstname || '',
          lastname: res.data.user.lastname || '',
        });
      } catch (err) {
        setError('Impossible de charger le profil.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updatedData = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
      };
      await api.put('/user/profile', updatedData);
      setMessage('Profil mis à jour avec succès !');
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 text-white">
        <p className="text-xl">Chargement...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-fuchsia-600 text-white flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Mon profil</h2>

        {message && (
          <div className="bg-green-500/20 text-green-200 p-3 mb-4 rounded-md text-sm text-center">
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
            <label htmlFor="email" className="block mb-1 text-sm text-white/80">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              disabled
              value={profile.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border-none outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="firstname" className="block mb-1 text-sm text-white/80">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={profile.firstname}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block mb-1 text-sm text-white/80">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={profile.lastname}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition font-semibold shadow-lg"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
