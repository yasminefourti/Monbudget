"use client";

import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const RESET_URL = `${BACKEND}/reset-password`;
const CHECK_EMAIL_URL = `${BACKEND}/reset-password/check-email`;

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
      // FormData avec le nom exact attendu par Symfony
      const formData = new FormData();
      formData.append("reset_password_request_form[email]", email); // ajouter

      // Optionnel : vérification console
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await fetch(RESET_URL, {
        method: "POST",
        body: formData,
        credentials: "include",   // envoie les cookies si nécessaire
        redirect: "follow",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // Si le backend redirige, on suit la redirection
      if (res.redirected && res.url) {
        window.location.assign(res.url);
        return;
      }

      // Sinon, on navigue vers la page check-email pour simuler le flux Symfony
      window.location.assign(CHECK_EMAIL_URL);

    } catch (err) {
      console.error(err);
      setError(`Erreur: ${err.message}`);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            disabled={loading}
            className={`w-full p-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 transform hover:scale-[1.02]"
            }`}
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
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
