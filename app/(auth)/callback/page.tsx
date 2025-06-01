// app/(auth)/callback/page.tsx
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import carga from "../../../assets/Carga.png";
export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("accessToken");
    if (token) {
      // Parseamos el payload del JWT
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Incluimos nombre y apellidos en el contexto
      login(token, payload.nombre, payload.apellido);
      // Redirigir al home de cliente
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [params, login, router]);

   return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] p-6 space-y-8">
      {/* Logo centrado */}
      <div className="flex items-center justify-center bg-grey/80 backdrop-blur-md rounded-full overflow-hidden shadow-md
                         w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-2 sm:p-4 md:p-6">
        <Image
          src={carga}
          alt="Express Café Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Spinner y mensaje */}
      <div className="flex flex-col items-center">
        <div className="border-4 border-[#DCD1C1] border-t-4 border-t-[#E27A3F] rounded-full
                           w-12 h-12 sm:w-16 sm:h-16 animate-spin mb-4" />
        <p className="text-[#4C2A10] text-lg sm:text-xl">Autenticando...</p>
      </div>
    </div>
  );
}
