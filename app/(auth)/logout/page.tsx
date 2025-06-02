"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import logo from "../../../assets/logo.png";
export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Al montar, cerramos sesión y vamos a /login
    logout();
    router.replace("/login");
     localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("nombre");
      localStorage.removeItem("apellidos");
  }, [logout, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] p-6">
      {/* Logo centrado */}
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full overflow-hidden shadow-md w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-6">
        <Image
          src={logo}
          alt="Express Café Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Spinner y mensaje */}
      <div className="flex flex-col items-center">
        <div className="border-4 border-[#DCD1C1] border-t-4 border-t-[#E27A3F] rounded-full w-12 h-12 sm:w-16 sm:h-16 animate-spin mb-4" />
        <p className="text-[#4C2A10] text-lg sm:text-xl">Cerrando sesión…</p>
      </div>
    </div>
  );
}
