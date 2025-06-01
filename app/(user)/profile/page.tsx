// app/(user)/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // <-- Importar Image de Next.js
import { useAuth } from "../../../context/AuthContext";
import { useClientes, Cliente } from "../../../hooks/useClientes";
import Link from "next/link";
import principal from "../../../assets/rel.png";

/**
 * Página de Perfil del Usuario (/user/profile)
 * - Obtiene nombre, apellidos y email desde AuthContext
 * - Busca en “clientes” (useClientes) el registro correspondiente
 * - Muestra datos adicionales (fecha_registro, id_rol) si existe en BD
 * - Si NO existe cliente, muestra aviso para completar registro
 * - Genera avatar de iniciales con efecto solapado sobre el banner
 * - Paleta basada en los colores de UserHomePage
 */
export default function UserProfilePage() {
  const { accessToken, role, nombre, apellidos, email } = useAuth();
  const router = useRouter();

  const {
    data: clientes,
    isLoading: clientesLoading,
    error: clientesError,
  } = useClientes();

  const [miCliente, setMiCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    // Redirecciones de autenticación y rol
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role !== 1) {
      router.replace("/admin");
      return;
    }
    // Buscar cliente por email
    if (clientes && email) {
      const encontrado = clientes.find((c) => c.email === email);
      setMiCliente(encontrado || null);
    }
  }, [accessToken, role, router, clientes, email]);

  if (clientesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FEF5E7]">
        <p className="text-[#4C2A10] animate-pulse text-lg">
          Cargando tu perfil…
        </p>
      </div>
    );
  }
  if (clientesError) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FEF5E7]">
        <p className="text-red-500 font-semibold text-lg">
          No fue posible cargar tu información.
        </p>
      </div>
    );
  }

  const firstInicial = nombre?.charAt(0).toUpperCase() || "";
  const lastInicial = apellidos?.charAt(0).toUpperCase() || "";

  return (
    <main className="min-h-screen bg-[#FEF5E7]">
      {/* ---------- BANNER SUPERIOR ---------- */}
      <section className="relative h-64 bg-gradient-to-br from-[#F2C894] to-[#FEF5E7]">
        {/* Nombre y email centrados */}
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4C2A10]">
            {nombre || "Nombre"} {apellidos || ""}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{email || ""}</p>
        </div>

        {/* Avatar circular solapado */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#ffb833] to-[#b47704] flex items-center justify-center shadow-2xl ring-4 ring-white">
              <Image
                src={principal}
                alt="Logo ExpressCafe"
                width={180}
                height={180}
                className="object-cover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Espacio para el solapado del avatar */}
      <div className="h-20"></div>

      {/* ---------- SECCIÓN PRINCIPAL: DETALLES ---------- */}
      <section className="px-6 lg:px-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ------ COLUMNA IZQUIERDA: ACCIONES ------ */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <button
              className="w-full px-6 py-2 bg-[#4C2A10] hover:bg-[#3a200b] text-white rounded-full text-sm font-medium shadow-md transition-colors"
              onClick={() => router.push("/favorites")}
            >
              Favoritos
            </button>
            <button
              className="w-full px-6 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-full text-sm font-medium shadow-md transition-colors"
              onClick={() => router.push("/products")}
            >
              Ir a Catálogo
            </button>
            <Link
              href="/orders"
              className="w-full px-6 py-2 border-2 border-[#4C2A10] hover:bg-[#4C2A10] hover:text-white rounded-full text-sm font-medium text-[#4C2A10] transition-colors"
            >
              Mis Pedidos
            </Link>

            {/* ---------- IMAGEN DEBAJO DE "Mis Pedidos" ---------- */}
            <div className="w-full h-full flex justify-center content-center mt-6">
              <Image
                src={principal}
                alt="Logo ExpressCafe"
                width={180}
                height={180}
                className="object-cover w-full"
              />
            </div>
          </div>

          {/* ------ COLUMNA CENTRAL: INFORMACIÓN PERSONAL ------ */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-[#4C2A10] mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700 font-medium">Nombre:</p>
                  <p className="text-[#4C2A10]">{nombre || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Apellidos:</p>
                  <p className="text-[#4C2A10]">{apellidos || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Email:</p>
                  <p className="text-[#4C2A10]">{email || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Rol en el sitio:</p>
                  <p className="text-[#4C2A10]">Cliente</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#4C2A10]">
                Detalles de Cuenta
              </h2>

              {miCliente ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center bg-[#F7F3ED] rounded-xl p-4 border border-[#F2C894]">
                    <span className="text-gray-700 font-medium">
                      ID Cliente:
                    </span>
                    <span className="text-[#4C2A10]">
                      {miCliente.id_cliente}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F7F3ED] rounded-xl p-4 border border-[#F2C894]">
                    <span className="text-gray-700 font-medium">
                      Fecha de registro:
                    </span>
                    <span className="text-[#4C2A10]">
                      {new Date(miCliente.fecha_registro).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F7F3ED] rounded-xl p-4 border border-[#F2C894]">
                    <span className="text-gray-700 font-medium">Rol:</span>
                    <span className="text-[#4C2A10]">
                      {miCliente.id_rol === 1
                        ? "Cliente"
                        : miCliente.id_rol === 2
                        ? "Empleado"
                        : "Admin"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FDEEEE] border-l-4 border-[#B21C1C] text-[#B21C1C] p-6 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#B21C1C] mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 19.07a7.07 7.07 0 100-14.14 7.07 7.07 0 000 14.14z"
                      />
                    </svg>
                    <p className="font-medium">
                      Aún no estás registrado como cliente.
                    </p>
                  </div>
                  <p>Completa tus datos para ver más detalles.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
