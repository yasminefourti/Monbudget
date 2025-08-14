//src/app/dashboard/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [goalProgress, setGoalProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ firstname: '', lastname: '' });

  useEffect(() => {
    // Charger le prénom et nom depuis localStorage
    const storedFirstName = localStorage.getItem('firstName') || '';
    const storedLastName = localStorage.getItem('lastName') || '';
    setUser({ firstname: storedFirstName, lastname: storedLastName });

    const fetchGoalProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Token manquant - veuillez vous reconnecter");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/budget/goals/1/progress', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expirée - veuillez vous reconnecter");
            return;
          }
          if (response.status === 404) {
            setError("Objectif non trouvé");
            return;
          }
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && typeof data === 'object' && data.objectif) {
          setGoalProgress(data);
        } else {
          throw new Error("Format de données invalide");
        }

      } catch (err) {
        setError(err.message || "Erreur lors du chargement de l'objectif");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalProgress();
  }, [router]);

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

  return (
    <main className="min-h-screen bg-gradient-to-br p-5 font-sans from-slate-600 via-teal-600 to-cyan-600 shadow-md">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-cyan-200 backdrop-blur-lg rounded-2xl p-6 mb-5 flex justify-between items-center shadow-xl">
          <div className="flex items-center text-2xl font-bold text-black">
            <span className="mr-2 text-3xl">💰</span> YassBudget
          </div>
          <div className="flex items-center gap-4">
            <span>
               {user.firstname}, {user.lastname}
            </span>
            <div className="w-10 h-10 bg-amber-50 text-black rounded-full flex items-center justify-center font-bold">
              {user.firstname?.[0]?.toUpperCase() || ''}
            </div>
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
                    <span className="text-red-500">Erreur de chargement</span>
                  ) : goalProgress?.objectif?.title ? (
                    `Objectif: ${goalProgress.objectif.title}`
                  ) : (
                    'Aucun objectif défini'
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded mt-1"></div>
                  ) : goalProgress?.objectif?.endDate ? (
                    `Échéance: ${formatDate(goalProgress.objectif.endDate)}`
                  ) : (
                    'Aucune échéance définie'
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-2 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="text-red-600 text-sm font-medium">⚠️ {error}</div>
              </div>
            ) : goalProgress ? (
              <>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{goalProgress.currentAmount || 0}€ économisés</span>
                  <span>{goalProgress.targetAmount || 0}€ objectif</span>
                </div>
                <div className="h-5 bg-gray-300 rounded overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r bg-emerald-700 transition-all duration-500"
                    style={{
                      width: `${calculateProgress(goalProgress.currentAmount, goalProgress.targetAmount)}%`
                    }}
                  ></div>
                </div>
                <div className="text-sm text-black mb-4">
                  ✅ Il vous reste {Math.max(0, (goalProgress.targetAmount || 0) - (goalProgress.currentAmount || 0))}€ à économiser
                  {goalProgress.daysRemaining && (
                    ` (${goalProgress.daysRemaining} jours restants)`
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">Aucun objectif configuré</div>
            )}

            <button
              onClick={() => router.push('/goals')}
              className="bg-cyan-200 text-emerald-950 py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {goalProgress ? 'Ajuster l\'objectif' : 'Créer un objectif'}
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
                onClick={() => alert("Voir toutes les transactions")}
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
              >
                Voir tout
              </button>
            </div>
          </div>

          {/* Catégories */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-bold text-gray-800 flex items-center">📋 Catégories</div>
              <button
                onClick={() => alert("Gérer les catégories")}
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
              >
                Gérer
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
