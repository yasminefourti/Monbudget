//src/pages/login.js
//src/app/login/page.js
'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import api from "lib/api"; // ✅ Corrigé ici

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (error) {
      if (error.response) {
        console.error("Erreur backend :", error.response.data);
        alert(error.response.data.message || "Erreur de connexion");
      } else {
        console.error("Erreur réseau :", error.message);
        alert("Erreur de connexion au serveur");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <label htmlFor="password" className="sr-only">Mot de passe</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ width: "100%", padding: "0.75rem" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}
