// src/app/reset-password/[token]/page.js
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas ❌");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Lien invalide ou expiré");
      }

      setMessage("Mot de passe modifié avec succès ✅");
      setPassword("");
      setConfirm("");

      // Redirection après succès
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-200">
        <h1 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          Réinitialiser votre mot de passe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 text-white p-3 rounded-xl font-semibold hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 shadow-md"
          >
            Réinitialiser
          </button>
        </form>
      </div>
    </main>
  );
}
