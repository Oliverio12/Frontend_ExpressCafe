// app/(user)/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "../../context/AuthContext";
import { useProductos, Producto } from "../../hooks/useProductos";
import { useCategorias, Categoria } from "../../hooks/useCategorias";

import principal from "../../assets/principal.png";
// Importamos la imagen decorativa
import decor from "../../assets/products.png";

export default function UserHomePage() {
  const { accessToken, role } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: productos,
    isLoading: productosLoading,
    error: productosError,
  } = useProductos();

  const {
    data: categorias,
    isLoading: categoriasLoading,
    error: categoriasError,
  } = useCategorias();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role !== 1) {
      router.replace("/admin");
    }
  }, [accessToken, role, router]);

  const ultimosProductos = useMemo<Producto[]>(() => {
    if (!productos) return [];
    return productos.slice(-6).reverse();
  }, [productos]);

  const categoriaMap = useMemo<Record<number, string>>(() => {
    if (!categorias) return {};
    return categorias.reduce((map, cat: Categoria) => {
      map[cat.id_categoria] = cat.nombre;
      return map;
    }, {} as Record<number, string>);
  }, [categorias]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <main className="flex-1 pt-10 px-6 sm:px-10 lg:px-20 bg-[#FEF5E7] overflow-auto">
      {/* ---------------------- Hero + Search ---------------------- */}
      <section className="relative mb-10">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* IZQUIERDA: texto y búsqueda */}
            <div className="w-full md:w-2/3 bg-white p-10 md:pl-16">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#4C2A10] mb-6 leading-tight">
                Descubre tu próximo favorito
              </h1>
              <p className="text-lg text-gray-600 mb-10">
                Explora nuestra variedad de cafés exclusivos y delicias
                artesanales. Cada taza y cada bocado está pensado para
                sorprender tu paladar.
              </p>

              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Buscar productos..."
                  className="w-full border border-gray-300 rounded-full py-3 pl-6 pr-14 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E27A3F] focus:border-transparent transition-shadow shadow-md hover:shadow-lg"
                />
                <button
                  onClick={handleSearch}
                  aria-label="Buscar"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-full p-2 shadow transition-colors"
                >
                  {/* Ícono de lupa */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 8.65a7.5 7.5 0 010 10.6z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* DERECHA: degradado suave y logo */}
            <div className="w-full md:w-1/3 bg-gradient-to-br from-[#F2C894] to-[#FEF5E7] flex items-center justify-center p-10">
              <div className="bg-white p-6 rounded-full shadow-lg">
                <Image
                  src={principal}
                  alt="Logo ExpressCafe"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------- Productos Destacados ---------------------- */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4C2A10] mb-6">
          Productos Destacados
        </h2>

        {productosLoading ? (
          <p className="text-[#4C2A10]">Cargando productos…</p>
        ) : productosError ? (
          <p className="text-red-500">Error al cargar productos.</p>
        ) : ultimosProductos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ultimosProductos.map((p: Producto) => (
              <div
                key={p.id_producto}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col"
              >
                {/* Imagen principal del producto */}
                <div className="h-44 bg-[#F7F3ED] rounded-xl mb-5 overflow-hidden flex items-center justify-center transition-transform transform hover:scale-105">
                  {p.imagen_url ? (
                    <img
                      src={p.imagen_url}
                      alt={p.nombre}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-[#4C2A10]">Sin imagen</span>
                  )}
                </div>
                <Image
                  src={decor}
                  alt="Decorativo"
                  width={64}
                  height={64}
                  className="absolute top-2 right-2 opacity-80 pointer-events-none"
                />
                <div className="flex-1 flex flex-col">
                  {/* Nombre */}
                  <h3 className="text-lg font-semibold text-[#4C2A10] mb-2">
                    {p.nombre}
                  </h3>

                  {/* Descripción */}
                  {p.descripcion && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {p.descripcion}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      {/* Precio */}
                      <p className="text-[#7AB800] font-bold text-lg">
                        ${p.precio.toFixed(2)}
                      </p>
                      {/* Disponible */}
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          p.disponible
                            ? "bg-[#DFF5E0] text-[#4C2A10]"
                            : "bg-[#FDEEEE] text-[#B21C1C]"
                        }`}
                      >
                        {p.disponible ? "Disponible" : "Agotado"}
                      </span>
                    </div>

                    {/* Categoría */}
                    <p className="text-[#4C2A10] text-sm mb-4">
                      <strong>Categoría:</strong>{" "}
                      {categoriasLoading
                        ? "Cargando..."
                        : categoriasError
                        ? "—"
                        : categoriaMap[p.id_categoria] || "Desconocida"}
                    </p>

                    {/* Botón Ver Detalles */}
                    <Link
                      href={`/products/${p.id_producto}`}
                      className="block text-center w-full py-2 bg-[#4C2A10] hover:bg-[#3a200b] text-white rounded-lg font-medium transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#4C2A10]">No hay productos disponibles.</p>
        )}
      </section>
    </main>
  );
}
