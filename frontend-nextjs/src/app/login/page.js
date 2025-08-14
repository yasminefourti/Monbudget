//src/app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Identifiants incorrects");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      // ✅ AJOUT : Récupérer le profil après connexion
      const profileRes = await fetch("http://localhost:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        localStorage.setItem("firstName", profileData.user.firstname); // ✅ AJOUT
        localStorage.setItem("lastName", profileData.user.lastname);   // ✅ AJOUT
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-200">
        
        {/* Logo & Titre */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600 rounded-full p-3 shadow-md">
            <span className="text-white font-bold text-xl">y</span>
          </div>
          <span className="ml-3 text-2xl font-bold text-slate-700">yassbudget</span>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          Connexion à votre compte
        </h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 text-white p-3 rounded-xl font-semibold hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 shadow-md"
          >
            Se connecter
          </button>
        </form>

        {/* Lien inscription */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-teal-600 font-medium hover:underline"
          >
            Créer un compte
          </a>
        </p>
      </div>
    </main>
  );
}
