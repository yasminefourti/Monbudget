// src/app/page.js

// src/app/page.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800 overflow-hidden relative">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/12 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-3/5 right-1/12 w-30 h-30 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/5 left-1/5 w-15 h-15 bg-white/10 rounded-full animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center min-h-screen">
        {/* Hero Content */}
        <div className={`text-white transition-all duration-800 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="flex items-center mb-8 text-3xl font-bold">
            <span className="text-4xl mr-3">💰</span>
            YassBudget 
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Bienvenue sur YassBudget 💰
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
            Votre application de gestion de budget personnel.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "📊", title: "Suivi en temps réel", desc: "Visualisez vos finances instantanément" },
              { icon: "🎯", title: "Objectifs personnalisés", desc: "Atteignez vos objectifs financiers" },
              { icon: "📱", title: "Interface intuitive", desc: "Design moderne et facile" },
              { icon: "🔒", title: "Sécurisé", desc: "Vos données protégées" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 transition-all duration-500 hover:transform hover:-translate-y-2 hover:bg-white/15 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div className={`transition-all duration-800 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 hover:transform hover:-translate-y-3 transition-all duration-300 hover:shadow-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Commencer maintenant
            </h2>

            <div className="space-y-4">
              <Link
                href="/login"
                className="group relative w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center block overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                <span className="relative">Se connecter</span>
              </Link>
              
              <Link
                href="/register"
                className="group relative w-full px-8 py-4 bg-transparent text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-center block"
              >
                Créer un compte
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Rejoignez des milliers d'utilisateurs qui gèrent mieux leur budget
              </p>
              <div className="flex justify-center items-center mt-4 space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Gratuit
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Sécurisé
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Simple
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 4s;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </main>
  );
}


