// app/not-found.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta según tu estructura

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] p-8 space-y-8">
      <div className="bg-white/80 backdrop-blur-md rounded-full overflow-hidden shadow-md w-24 h-24 sm:w-32 sm:h-32 p-2 sm:p-4">
        <Image src={logo} alt="Express Café 404" fill className="object-contain" />
      </div>
      <h1 className="text-6xl font-extrabold text-[#4C2A10]">404</h1>
      <p className="text-xl text-[#4C2A10] text-center">Lo sentimos, la página que buscas no existe.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#E27A3F] hover:bg-[#D4722E] text-white font-semibold rounded-lg transition"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
