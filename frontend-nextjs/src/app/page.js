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
    <main className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 overflow-hidden relative">
      {/* Floating Elements avec couleurs douces */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/12 w-20 h-20 bg-gradient-to-br from-teal-400/15 to-cyan-500/15 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-3/5 right-1/12 w-30 h-30 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full animate-float-delayed blur-sm"></div>
        <div className="absolute bottom-1/5 left-1/5 w-15 h-15 bg-gradient-to-br from-cyan-400/20 to-sky-400/20 rounded-full animate-float-slow blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-300/15 to-cyan-300/15 rounded-full animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center min-h-screen">
        {/* Hero Content */}
        <div className={`text-white transition-all duration-800 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="flex items-center mb-8 text-3xl font-bold">
            <span className="text-4xl mr-3">💰</span>
            <span className="bg-gradient-to-r from-slate-100 via-cyan-100 to-teal-100 bg-clip-text text-transparent">
              YassBudget
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-slate-100 via-cyan-50 to-teal-100 bg-clip-text text-transparent drop-shadow-lg">
            Bienvenue sur YassBudget 💰
          </h1>
          
          <p className="text-xl lg:text-2xl mb-12 text-slate-200/95 leading-relaxed font-medium">
            Votre application de gestion de budget personnel.
          </p>

          {/* Features Grid avec couleurs douces */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "📊", title: "Suivi en temps réel", desc: "Visualisez vos finances instantanément", gradient: "from-slate-500/30 to-teal-500/20" },
              { icon: "🎯", title: "Objectifs personnalisés", desc: "Atteignez vos objectifs financiers", gradient: "from-cyan-500/20 to-slate-500/30" },
              { icon: "📱", title: "Interface intuitive", desc: "Design moderne et facile", gradient: "from-teal-500/25 to-cyan-500/15" },
              { icon: "🔒", title: "Sécurisé", desc: "Vos données protégées", gradient: "from-sky-500/20 to-teal-500/25" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-md p-5 rounded-2xl border border-slate-400/30 transition-all duration-500 hover:transform hover:-translate-y-2 hover:scale-105 hover:border-teal-400/40 hover:shadow-xl hover:shadow-teal-500/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-slate-300/90 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card avec couleurs douces */}
        <div className={`transition-all duration-800 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="bg-slate-50/96 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-200/50 hover:transform hover:-translate-y-3 transition-all duration-300 hover:shadow-3xl hover:shadow-slate-500/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent mb-8 text-center">
              Commencer maintenant
            </h2>

            <div className="space-y-4">
              <Link
                href="/login"
                className="group relative w-full px-8 py-4 bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/25 text-center block overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                <span className="relative">Se connecter</span>
              </Link>
              
              <Link
                href="/register"
                className="group relative w-full px-8 py-4 bg-transparent text-teal-700 border-2 border-teal-600 hover:bg-gradient-to-r hover:from-teal-600 hover:to-cyan-600 hover:text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/15 text-center block"
              >
                Créer un compte
              </Link>
            </div>

            {/* Additional Info avec couleurs douces */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 text-center font-medium">
                Rejoignez des milliers d'utilisateurs qui gèrent mieux leur budget
              </p>
              <div className="flex justify-center items-center mt-4 space-x-6 text-sm text-slate-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mr-2"></span>
                  Gratuit
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-slate-500 to-teal-500 rounded-full mr-2"></span>
                  Sécurisé
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full mr-2"></span>
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