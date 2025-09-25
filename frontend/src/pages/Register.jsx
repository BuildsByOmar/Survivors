import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, password, email: null })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Inscription réussie ! Connecte-toi.");
        setName(""); setPassword("");
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="border-4 border-green-500 w-full max-w-lg px-12 py-14" style={{fontFamily: 'Hack, monospace', padding: '3rem'}}>
        <h1 className="text-5xl font-bold text-green-500 mb-12 text-center">S’inscrire</h1>
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-green-500 font-bold mb-2 text-[1.5rem]">Nom</label>
            <div className="flex items-center text-green-500 text-xl font-mono">
              <span className="mr-2 text-[1.5rem]">&gt;</span>
                &nbsp;<input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-transparent border-none outline-none text-green-500 font-mono text-[1.5rem] w-full caret-green-500"
                  style={{ fontFamily: 'Hack, monospace', color: '#00FF00', caretWidth: '1ch' }}
                  autoComplete="username"
                  required
                />
            </div>
          </div>
          <div>
            <label className="block text-green-500 font-bold mb-2 text-[1.5rem]">Mot de passe</label>
            <div className="flex items-center text-green-500 text-xl font-mono">
              <span className="mr-2 text-[1.5rem]">&gt;</span>
                &nbsp;<input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none text-green-500 font-mono text-[1.5rem] w-full caret-green-500"
                  style={{ fontFamily: 'Hack, monospace', color: '#00FF00', caretWidth: '1rem' }}
                  autoComplete="current-password"
                  required
                />
            </div>
          </div>
          <div className="flex justify-center mt-8 mb-2">
            <button
              type="submit"
              className=" border-2 border-green-500 text-green-500 text-[1.5rem] px-16 py-2 font-mono bg-transparent focus:outline-none focus:ring-0 transition-all duration-200"
              style={{ color: '#00FF00' }}
              onMouseEnter={e => e.currentTarget.style.borderBottom = '2px solid #00FF00'}
              onMouseLeave={e => e.currentTarget.style.borderBottom = ''}
            >
              Confirmer
            </button>
          </div>
          {message && <div className="text-green-500 text-center mt-4">{message}</div>}
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </form>
        <div className="text-green-500 text-center mt-8 font-mono text-[1rem]">
          Vous êtes déjà inscrit ?{' '}
          <a href="/login" className="underline" style={{ color: '#00FF00' }}>Connectez vous</a>
        </div>
      </div>
    </div>
  );
}