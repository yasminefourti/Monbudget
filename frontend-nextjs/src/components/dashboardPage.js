'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage({ title }) {
  const router = useRouter();
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-white"
          >
            <h2 className="text-xl font-semibold">Card {i}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Contenu pour la carte {i}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Ajouter
        </button>
      </div>
    </div>
  );
}

