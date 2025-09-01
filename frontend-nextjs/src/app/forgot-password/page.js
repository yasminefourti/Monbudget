//forgot-password/page.js
"use client";

import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const API_RESET_URL = `${BACKEND}/reset-password`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(API_RESET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email.trim()
        }),
      });

      const data = await response.json();

      console.log("Response:", {
        status: response.status,
        data
      });

      if (!response.ok) {
        // Gestion des erreurs
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join(", "));
        } else {
          setError(data.message || "Une erreur est survenue");
        }
        return;
      }

      // Succès
      setMessage(data.message);
      setEmail(""); // Vider le champ

      // Optionnel : rediriger après quelques secondes
      setTimeout(() => {
        // Vous pouvez rediriger vers une page de confirmation
        // window.location.href = "/login";
      }, 3000);

    } catch (err) {
      console.error("Network error:", err);
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-200">
        <h1 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          Mot de passe oublié
        </h1>

        {/* Debug info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p>API URL: {API_RESET_URL}</p>
            <p>Backend: {BACKEND}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className={`w-full p-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading || !email.trim()
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 transform hover:scale-[1.02]"
            }`}
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Retour à la{" "}
          <a href="/login" className="text-teal-600 font-medium hover:underline">
            Connexion
          </a>
        </p>
      </div>
    </main>
  );
}