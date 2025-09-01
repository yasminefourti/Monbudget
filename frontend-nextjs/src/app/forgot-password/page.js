// // src/app/forgot-password/page.js
// "use client";

// import { useState } from "react";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setMessage(null);
//     setLoading(true);

//     try {
//       console.log("Envoi de l'email:", email);

//       // Utiliser le format simple qui fonctionne (Format 1)
//       const formData = new FormData();
//       formData.append("email", email);

//       console.log("Données à envoyer:");
//       for (let [key, value] of formData.entries()) {
//         console.log(`  ${key}: ${value}`);
//       }

//       const res = await fetch("http://localhost:8000/reset-password", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//         headers: {
//           'Accept': 'application/json, text/html, */*',
//           'X-Requested-With': 'XMLHttpRequest',
//         }
//       });

//       console.log("Réponse:", res.status, res.statusText);

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.log("Erreur détaillée:", errorText);
//         throw new Error(`Erreur HTTP ${res.status}: ${res.statusText}`);
//       }

//       // Traiter la réponse
//       const contentType = res.headers.get("content-type");
//       let responseData;
      
//       if (contentType && contentType.includes("application/json")) {
//         responseData = await res.json();
//         console.log("Réponse JSON:", responseData);
//       } else {
//         responseData = await res.text();
//         console.log("Réponse HTML/Text:", responseData.substring(0, 200));
//       }

//       setMessage("Si un compte existe avec cet email, un lien a été envoyé ✅");
//       setEmail("");

//     } catch (err) {
//       console.error("Erreur:", err);
//       setError(`Erreur: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-teal-600 to-cyan-600">
//       <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-slate-200">
//         <h1 className="text-xl font-semibold text-slate-800 mb-6 text-center">
//           Mot de passe oublié
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Votre email"
//             className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           {message && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//               <p className="text-green-700 text-sm">{message}</p>
//             </div>
//           )}
          
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full p-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
//               loading
//                 ? "bg-slate-400 cursor-not-allowed"
//                 : "bg-gradient-to-r from-slate-600 via-teal-600 to-cyan-600 hover:from-slate-700 hover:via-teal-700 hover:to-cyan-700 transform hover:scale-[1.02]"
//             }`}
//           >
//             {loading ? "Envoi..." : "Envoyer le lien"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-slate-500 mt-6">
//           Retour à la{" "}
//           <a href="/login" className="text-teal-600 font-medium hover:underline">
//             Connexion
//           </a>
//         </p>
//       </div>
//     </main>
//   );
// }


// src/app/forgot-password/page.js
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
      // Build form data like a normal browser form submit
      const formData = new FormData();
      formData.append("email", email);

      const res = await fetch(RESET_URL, {
        method: "POST",
        body: formData,
        credentials: "include",   // send cookies if needed by Symfony
        redirect: "follow",       // follow 302 server-side
        // NOTE: no 'X-Requested-With' header => avoid AJAX mode
        headers: {
          // Ask for HTML like a regular browser navigation
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // If server responded with a redirect, fetch followed it, so we manually navigate
      if (res.redirected && res.url) {
        window.location.assign(res.url);
        return;
      }

      // Some setups return 200 + HTML for the "check email" page (no 302)
      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (contentType.includes("text/html")) {
        // Mirror the direct-backend flow: navigate so Symfony logs the GET /check-email
        window.location.assign(CHECK_EMAIL_URL);
        return;
      }

      // If backend answers JSON (custom handler), still navigate to keep behavior identical
      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        /* ignore */
      }

      if (res.ok) {
        // Navigate to the same page the backend would show
        window.location.assign(CHECK_EMAIL_URL);
        return;
      }

      // Error cases
      const errText = data?.message || (await res.text());
      throw new Error(errText || `HTTP ${res.status}`);
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
