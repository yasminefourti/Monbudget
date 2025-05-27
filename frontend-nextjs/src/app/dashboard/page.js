'use client';
const id = 1;
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [goalProgress, setGoalProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoalProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("Token:", token);

        if (!token) {
          setError("Token manquant - veuillez vous reconnecter");
          setLoading(false);
          return;
        }

        // Appel vers votre API backend qui fonctionne
        const response = await fetch('http://localhost:8000/api/budget/goals/1/progress', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log("Response status:", response.status);
        console.log("Response URL:", response.url);

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expirée - veuillez vous reconnecter");
            return;
          }
          if (response.status === 404) {
            setError("Objectif non trouvé");
            return;
          }
          if (response.status === 0 || response.status >= 500) {
            setError("Serveur non accessible - vérifiez que votre API est démarrée");
            return;
          }
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Data reçue:", data);
        
        // Vos données correspondent exactement au format attendu !
        // {
        //   "currentAmount": 150,
        //   "targetAmount": 2000,
        //   "progression": 7.5,
        //   "daysRemaining": 217,
        //   "objectif": {
        //     "id": 1,
        //     "title": "Épargne pour vacances",
        //     "startDate": "2025-05-15",
        //     "endDate": "2025-12-31"
        //   }
        // }
        
        if (data && typeof data === 'object' && data.objectif) {
          setGoalProgress(data);
        } else {
          throw new Error("Format de données invalide");
        }

      } catch (err) {
        console.error("Erreur lors du fetch de l'objectif:", err);
        setError(err.message || "Erreur lors du chargement de l'objectif");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalProgress();
  }, [router]);

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Fonction pour calculer le pourcentage de progression
  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 mb-5 flex justify-between items-center shadow-xl">
          <div className="flex items-center text-2xl font-bold text-indigo-500">
            <span className="mr-2 text-3xl">💰</span> YassBudget
          </div>
          <div className="flex items-center gap-4">
            <span>Bonjour, Marie</span>
            <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
              M
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Objectif */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg mr-4">🎯</div>
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

            {/* Affichage conditionnel selon l'état */}
            {loading ? (
              <div className="space-y-3 ">
                <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-2 w-full rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="text-red-600 text-sm font-medium">
                  ⚠️ {error}
                </div>
              </div>
            ) : goalProgress ? (
              <>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{goalProgress.currentAmount || 0}€ économisés</span>
                  <span>{goalProgress.targetAmount || 0}€ objectif</span>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
                    style={{ 
                      width: `${calculateProgress(goalProgress.currentAmount, goalProgress.targetAmount)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-emerald-600 mb-4">
                  ✅ Il vous reste {Math.max(0, (goalProgress.targetAmount || 0) - (goalProgress.currentAmount || 0))}€ à économiser
                  {goalProgress.daysRemaining && (
                    ` (${goalProgress.daysRemaining} jours restants)`
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">
                Aucun objectif configuré
              </div>
            )}

            <button
              onClick={() => router.push('/goals')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
              disabled={loading}
            >
              {goalProgress ? 'Ajuster l\'objectif' : 'Créer un objectif'}
            </button>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Transactions */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-bold text-gray-800 flex items-center">📊 Transactions Récentes</div>
              <button onClick={() => alert("Voir toutes les transactions")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
                Voir tout
              </button>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center border-b pb-3">
                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center mr-4">🛒</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Courses Carrefour</div>
                  <div className="text-xs text-gray-500">Aujourd'hui • Alimentation</div>
                </div>
                <div className="font-bold text-red-500">-85,50€</div>
              </li>
              <li className="flex items-center border-b pb-3">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-4">💰</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Salaire</div>
                  <div className="text-xs text-gray-500">Hier • Revenus</div>
                </div>
                <div className="font-bold text-emerald-500">+2 500,00€</div>
              </li>
              <li className="flex items-center border-b pb-3">
                <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center mr-4">⛽</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Essence Total</div>
                  <div className="text-xs text-gray-500">20 Mai • Transport</div>
                </div>
                <div className="font-bold text-red-500">-65,00€</div>
              </li>
              <li className="flex items-center">
                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center mr-4">🍽️</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Restaurant</div>
                  <div className="text-xs text-gray-500">19 Mai • Sorties</div>
                </div>
                <div className="font-bold text-red-500">-45,50€</div>
              </li>
            </ul>
            <button onClick={() => alert("Ajouter une transaction")}
              className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold">
              Ajouter une transaction
            </button>
          </div>

          {/* Catégories */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <div className="text-lg font-bold text-gray-800 flex items-center">📋 Catégories</div>
              <button onClick={() => alert("Gérer les catégories")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
                Gérer
              </button>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">Alimentation</span>
                </div>
                <span className="font-semibold text-gray-800">320€</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">Transport</span>
                </div>
                <span className="font-semibold text-gray-800">180€</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">Logement</span>
                </div>
                <span className="font-semibold text-gray-800">850€</span>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">Sorties</span>
                </div>
                <span className="font-semibold text-gray-800">125€</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-violet-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">Épargne</span>
                </div>
                <span className="font-semibold text-gray-800">175€</span>
              </li>
            </ul>
            <button onClick={() => alert("Nouvelle catégorie à implémenter")}
              className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold">
              Nouvelle catégorie
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}