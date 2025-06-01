// app/error.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import error500 from "../assets/500.png"; // Ajusta la ruta si es necesario

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] p-8 space-y-8">
      <div className="bg-white/80 backdrop-blur-md rounded-full overflow-hidden shadow-md w-24 h-24 sm:w-32 sm:h-32 p-2 sm:p-4">
        <Image src={error500} alt="Express Café Error" fill className="object-contain" />
      </div>
      <h1 className="text-5xl font-bold text-red-600 text-center">¡Ups! Algo salió mal.</h1>
      <p className="text-[#4C2A10] text-center">{error.message}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="px-5 py-3 bg-[#E27A3F] hover:bg-[#D4722E] text-white font-semibold rounded-lg transition"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-5 py-3 bg-white hover:bg-[#f3f3f3] text-[#4C2A10] font-semibold rounded-lg transition"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
