import React from "react";

import surv from "./surv.png";


export default function Home() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center px-4 mt-[-80px]">
      {/* Logo */}
      <img
        src={surv}
        alt="Survivors logo"
        className="w-32 h-32 rounded-full shadow-lg mb-6 mt-[-64px]"
      />

      {/* Titre & intro */}
    
      <p className="mb-8 text-gray-700 text-lg max-w-md">
        Trouve tout et n’importe quoi facilement sur <span className="font-semibold text-green-600">Survivors</span> !
      </p>
      {/* Barre de recherche stylée */}
  <form className="w-full max-w-md flex rounded-full shadow-lg border border-gray-200 overflow-hidden bg-transparent mt-[-8px]">
        <input
          type="text"
          placeholder="Rechercher..."
          className="flex-1 px-6 py-4 text-lg focus:outline-none bg-transparent placeholder-green-400"
          style={{ color: '#16a34a' }}
        />
        <button
          type="submit"
          className="px-6 py-4 rounded-r-full transition font-bold text-xl bg-transparent text-blue-600 hover:text-blue-700 border-none"
        >
          🔍
        </button>
      </form>
    </div>
  );
}