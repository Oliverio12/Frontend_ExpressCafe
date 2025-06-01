// app/(auth)/login/page.tsx
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEmployeeLogin } from "../../../hooks/useEmployeeLogin";
import logo from "../../../assets/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const mutation = useEmployeeLogin();
  const { status, mutate: loginEmployee } = mutation;
  const isLoading = status === "pending";

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    loginEmployee(
      { email, password },
      {
        onSuccess: () => router.push("/admin"),
        onError: (err: any) =>
          alert(err.response?.data?.message || "Credenciales inválidas"),
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] space-y-12">
      {/* --- BLOQUE LOGO --- */}
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full overflow-hidden shadow-md
                      w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-2 sm:p-4 md:p-6">
        <Image
          src={logo}
          alt="Express Café Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* --- BLOQUES SEPARADOS DE LOGIN --- */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* Usuario */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4C2A10] mb-4">
            Iniciar sesión como Usuario
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4C2A10] mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="usuario@correo.com"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#DCD1C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E27A3F] transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4C2A10] mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#DCD1C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E27A3F] transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 sm:py-3 bg-[#E27A3F] hover:bg-[#D4722E] text-white font-semibold rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#E27A3F] transition disabled:opacity-50"
            >
              {isLoading ? "Cargando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Cliente */}
        <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4C2A10] mb-4">
            Iniciar sesión como Cliente
          </h2>
          <button
            onClick={handleGoogle}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-[#7AB800] hover:bg-[#6DA000] text-white font-semibold rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#7AB800] transition"
          >
            <svg className="w-5 h-5 mr-2 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1h-9.17v2.92h5.26c-.23 1.23-1.17 3.61-5.26 3.61-3.16 0-5.75-2.6-5.75-5.81s2.59-5.81 5.75-5.81c1.8 0 3.01.77 3.71 1.43l2.53-2.45C17.04 3.3 15.02 2.25 12.18 2.25 6.71 2.25 2.25 6.82 2.25 12.25s4.46 10 9.93 10c5.73 0 9.53-4.01 9.53-9.64 0-.65-.07-1.14-.36-1.81z" />
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}