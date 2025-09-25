import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log('Connexion réussie');
        // ...autres actions (redirection, stockage, etc.)
      } else {
        console.log('Échec de la connexion');
      }
    } catch (error) {
      console.log('Erreur lors de la connexion', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="border-4 border-green-500 w-full max-w-lg px-12 py-14" style={{fontFamily: 'Hack, monospace', padding: '3rem'}}>
            <h1 className="text-5xl font-bold text-green-500 mb-12 text-center">Se connecter</h1>
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div>
                <label className="block text-green-500 font-bold mb-2 text-[1.5rem]">Identifiant</label>
                <div className="flex items-center text-green-500 text-xl font-mono">
                  <span className="mr-2 text-[1.5rem]">&gt;</span>
                    &nbsp;<input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="bg-transparent border-none outline-none text-green-500 font-mono text-[1.5rem] w-full caret-green-500"
                      style={{ fontFamily: 'Hack, monospace', color: '#00FF00', caretWidth: '1ch' }}
                      autoComplete="username"
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
            </form>
            <div className="text-green-500 text-center mt-8 font-mono text-[1rem]">
              Vous êtes nouveau ?{' '}
              <a href="/register" className="underline" style={{ color: '#00FF00' }}>Inscrivez vous</a>
            </div>
          </div>
        </div>
      );
    }
