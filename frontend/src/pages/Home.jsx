import React from "react";

export default function Home() {
  return (
    <>
      
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="flex flex-col items-center gap-4"> 
          {/* Titre */}
          <h1 className="text-4xl font-bold font-sans text-center">
            Survivors
          </h1>

          {/* Barre de recherche */}
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Entrez votre filtre de recherche..."
              className="w-full px-8 py-9 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
          </div>

          <button
            type="submit"
            className="px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            Rechercher
          </button>
        </div>

        {/* filtre */}
        <div className="mt-10">
          {/* Posts */}
        </div>
      </div>
    </>
  );
}
