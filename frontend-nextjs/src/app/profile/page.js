'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from 'lib/api';
import withAuth from 'components/withAuth';

function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    email: '',
    firstname: '',
    lastname: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);

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
    setUpdated(false);

    try {
      const updatedData = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
      };
      await api.put('/user/profile', updatedData);

      // 🔑 mise à jour localStorage pour que Dashboard affiche directement les bons noms
      localStorage.setItem('firstName', profile.firstname);
      localStorage.setItem('lastName', profile.lastname);

      setMessage('Profil mis à jour avec succès !');
      setUpdated(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.');
      console.error(err);
    }
  };

  const handleGoDashboard = () => {
    router.refresh(); // recharge les composants serveur
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white flex items-center justify-center p-6 relative">
      
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10">
          <p className="text-xl">Chargement...</p>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg relative z-0">
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
            <label htmlFor="email" className="block mb-1 text-sm text-white/80">
              Email
            </label>
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
            <label htmlFor="firstname" className="block mb-1 text-sm text-white/80">
              Prénom
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={profile.firstname}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block mb-1 text-sm text-white/80">
              Nom
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={profile.lastname}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 transition font-semibold shadow-lg"
          >
            Enregistrer
          </button>
        </form>

        {updated && (
          <button
            onClick={handleGoDashboard}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            Retour au Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
