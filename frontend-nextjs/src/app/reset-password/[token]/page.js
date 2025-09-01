"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/reset-password/reset/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ plainPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Lien invalide ou expiré");
      }

      setMessage("Mot de passe modifié avec succès ✅");
      setPassword("");
      setConfirm("");

      // Redirection après succès
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
          />

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700"
            }`}
          >
            {loading ? "Envoi..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </main>
  );
}
