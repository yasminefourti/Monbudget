//src/pages/login.js
'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import api from "../app/api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Données envoyées :", { email, password }); // Debug

    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      console.log("Réponse backend :", res.data);

      localStorage.setItem("token", res.data.token);
      console.log("Redirection vers dashboard");
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
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
