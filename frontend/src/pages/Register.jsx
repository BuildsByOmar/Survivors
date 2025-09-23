export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="border-4 border-green-500 p-10 w-full max-w-lg" style={{fontFamily: 'Hack, monospace'}}>
        <h1 className="text-5xl font-bold text-green-500 mb-12 text-center">S’authentifier</h1>
        <form className="space-y-10">
          <div>
            <label className="block text-2xl text-green-500 font-bold mb-2">Identifiant</label>
            <div className="flex items-center text-green-500 text-xl font-mono">
              <span className="mr-2">&gt;</span>
              <input
                type="text"
                placeholder="nom_identifiant"
                className="bg-black border-none outline-none text-green-500 placeholder-green-500 font-mono text-xl w-full"
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-2xl text-green-500 font-bold mb-2">Mot de passe</label>
            <div className="flex items-center text-green-500 text-xl font-mono">
              <span className="mr-2">&gt;</span>
              <input
                type="password"
                placeholder="mot_de_passe"
                className="bg-black border-none outline-none text-green-500 placeholder-green-500 font-mono text-xl w-full"
                autoComplete="current-password"
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="border-2 border-green-500 text-green-500 text-2xl px-16 py-2 font-mono transition hover:bg-green-500 hover:text-black">
              Confirmer
            </button>
          </div>
        </form>
        <div className="text-green-500 text-center mt-8 font-mono">
          Vous êtes déjà inscrit ?{' '}
          <a href="/login" className="underline hover:text-green-300">Connectez vous</a>
        </div>
      </div>
    </div>
  );
}
