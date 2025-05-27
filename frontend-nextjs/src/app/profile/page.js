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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Chargement...</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Mon profil</h2>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            disabled
            value={profile.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="firstname" className="block mb-1 font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={profile.firstname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block mb-1 font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={profile.lastname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default withAuth(ProfilePage);