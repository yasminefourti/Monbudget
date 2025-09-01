'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ firstname: '', lastname: '' });

  useEffect(() => {
    const storedFirstName = localStorage.getItem('firstName') || '';
    const storedLastName = localStorage.getItem('lastName') || '';
    setUser({ firstname: storedFirstName, lastname: storedLastName });

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Token manquant - veuillez vous reconnecter");
      setLoading(false);
      return;
    }

    const fetchDashboardAndCategories = async () => {
      try {
        const dashboardResp = await fetch('http://localhost:8000/api/budget/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!dashboardResp.ok) throw new Error("Erreur lors du chargement du dashboard");
        const dashboardJson = await dashboardResp.json();
        setDashboardData(dashboardJson);

        const categoriesResp = await fetch('http://localhost:8000/api/budget/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!categoriesResp.ok) throw new Error("Erreur lors du chargement des catégories");
        const categoriesJson = await categoriesResp.json();
        setCategories(categoriesJson);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndCategories();
  }, [router]);

  // Fonction déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.error("Erreur lors de la déconnexion", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      router.push('/login'); 
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const objectif = dashboardData?.objectif;

  return (
    <main className="min-h-screen bg-gradient-to-br p-5 font-sans from-slate-600 via-teal-600 to-cyan-600 shadow-md">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="bg-cyan-200 backdrop-blur-lg rounded-2xl p-6 mb-5 flex justify-between items-center shadow-xl">
          <div className="flex items-center text-2xl font-bold text-black">
            <span className="mr-2 text-3xl">💰</span> YassBudget
          </div>
          <div className="flex items-center gap-4">
            <span>{user.firstname}, {user.lastname}</span>
            <div className="w-10 h-10 bg-amber-50 text-black rounded-full flex items-center justify-center font-bold">
              {user.firstname?.[0]?.toUpperCase() || ''}
            </div>

            {/* Bouton Mon Profil */}
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors bg-gray-100"
            >
              <span>👤</span>
              <span>Mon Profil</span>
            </button>

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors bg-gray-100"
            >
              <span>🔒</span>
              <span>Se déconnecter</span>
            </button>
          </div>
        </header>

        {/* Objectif */}
        <div className="grid grid-cols-1 gap-5 mb-5">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-cyan-700 text-white rounded-full flex items-center justify-center text-lg mr-4">🎯</div>
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>
                  ) : error ? (
                    <span className="text-red-500">{error}</span>
                  ) : objectif?.title ? (
                    `Objectif: ${objectif.title}`
                  ) : (
                    'Aucun objectif défini'
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded mt-1"></div>
                  ) : objectif?.endDate ? (
                    `Échéance: ${formatDate(objectif.endDate)}`
                  ) : (
                    'Aucune échéance définie'
                  )}
                </div>
              </div>
            </div>

            {!loading && !error && objectif && (
              <>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{objectif.currentAmount || 0}€ économisés</span>
                  <span>{objectif.targetAmount || 0}€ objectif</span>
                </div>
                <div className="h-5 bg-gray-300 rounded overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r bg-emerald-700 transition-all duration-500"
                    style={{ width: `${calculateProgress(objectif.currentAmount, objectif.targetAmount)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-black mb-4">
                  ✅ Il vous reste {Math.max(0, (objectif.targetAmount || 0) - (objectif.currentAmount || 0))}€ à économiser
                  {objectif.daysRemaining && ` (${objectif.daysRemaining} jours restants)`}
                </div>
              </>
            )}

            <button
              onClick={() => router.push('/goals')}
              className="bg-cyan-200 text-emerald-950 py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {objectif ? "Ajuster l'objectif" : "Créer un objectif"}
            </button>
          </div>
        </div>

        {/* Transactions et Catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Transactions */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-bold text-gray-800 flex items-center">📊 Transactions Récentes</div>
              <button
                onClick={() => router.push(`/goals/${objectif?.id}/transactions`)}
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
              >
                Voir tout
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ) : objectif?.recentTransactions?.length > 0 ? (
              <ul className="space-y-3">
                {objectif.recentTransactions.map(tx => (
                  <li key={tx.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                    <div>
                      <span className={`font-semibold ${tx.type === 'recette' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'recette' ? '+' : '-'}{tx.amount}€
                      </span>
                      <span className="ml-2 text-gray-500">{tx.categorie.nom}</span>
                    </div>
                    <div className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString('fr-FR')}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center py-4">Aucune transaction récente</div>
            )}
          </div>

          {/* Catégories */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-bold text-gray-800 flex items-center">📋 Catégories</div>
              <button
                onClick={() => router.push('/categories')}
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
              >
                Gérer
              </button>
            </div>

            {loading ? (
              <div className="animate-pulse h-20 w-full bg-gray-200 rounded"></div>
            ) : categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id} className="p-2 bg-gray-100 rounded-lg text-gray-700">{cat.nom}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-center py-4">Aucune catégorie</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
