"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { useProductos, Producto } from "../../../hooks/useProductos";
import { useCategorias, Categoria } from "../../../hooks/useCategorias";
import Link from "next/link";
import Image from "next/image";
import decor from "../../../assets/products.png";

export default function FavoritesPage() {
  const { accessToken, role } = useAuth();
  const router = useRouter();

  // Hook para obtener todos los productos
  const {
    data: productos,
    isLoading: productosLoading,
    error: productosError,
  } = useProductos();

  // Hook para obtener todas las categorías
  const {
    data: categorias,
    isLoading: categoriasLoading,
    error: categoriasError,
  } = useCategorias();

  // Contexto de Favoritos
  const { favoritos, removeFavorite } = useFavorites();

  // Redirecciones de autenticación
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role !== 1) {
      router.replace("/admin");
      return;
    }
  }, [accessToken, role, router]);

  // Mapa id_categoria → nombre_categoria
  const categoriaMap = useMemo<Record<number, string>>(() => {
    if (!categorias) return {};
    return categorias.reduce((map, cat: Categoria) => {
      map[cat.id_categoria] = cat.nombre;
      return map;
    }, {} as Record<number, string>);
  }, [categorias]);

  // Filtrar sólo los productos que están en favoritos
  const productosFavoritos: Producto[] = useMemo(() => {
    if (!productos) return [];
    return productos.filter((p) => favoritos.includes(p.id_producto));
  }, [productos, favoritos]);

  // Estados de carga / error
  if (productosLoading || categoriasLoading) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Cargando favoritos…</p>
      </div>
    );
  }
  if (productosError) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error al cargar productos.</p>
      </div>
    );
  }
  if (categoriasError) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error al cargar categorías.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FEF5E7] to-[#F2C894]">
      <main className="flex-1 p-4 sm:p-8">
        <h2 className="text-2xl font-bold text-[#4C2A10] mb-4">Mis Favoritos</h2>

        {favoritos.length === 0 ? (
          <p className="text-[#4C2A10]">No tienes productos en Favoritos.</p>
        ) : productosFavoritos.length === 0 ? (
          // Si tu contexto ya tiene IDs, pero aún no llegaron los datos de productos
          <p className="text-[#4C2A10]">Cargando productos favoritos…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFavoritos.map((p: Producto) => (
              <div
                key={p.id_producto}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col"
              >
                {/* Imagen decorativa en la esquina superior derecha */}
                <Image
                  src={decor}
                  alt="Decorativo"
                  width={64}
                  height={64}
                  className="absolute top-2 right-2 opacity-80 pointer-events-none"
                />

                {/* Imagen del producto */}
                <div className="h-40 bg-[#DCD1C1] rounded-lg mb-4 overflow-hidden flex items-center justify-center">
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

                {/* Nombre */}
                <h3 className="text-lg font-semibold text-[#4C2A10] mb-1">
                  {p.nombre}
                </h3>

                {/* Descripción */}
                {p.descripcion && (
                  <p className="text-gray-600 text-sm mb-2">{p.descripcion}</p>
                )}

                {/* Precio */}
                <p className="text-[#7AB800] font-bold mb-1">
                  ${p.precio.toFixed(2)}
                </p>

                {/* Categoría */}
                <p className="text-[#4C2A10] text-sm mb-4 capitalize">
                  <strong>Categoría:</strong>{" "}
                  {categoriaMap[p.id_categoria] || "Desconocida"}
                </p>

                {/* Disponible */}
                <p className="text-[#4C2A10] text-sm mb-4 capitalize">
                  <strong>Disponible:</strong> {p.disponible ? "Sí" : "No"}
                </p>

                {/* Botón Quitar Favorito */}
                <button
                  onClick={() => removeFavorite(p.id_producto)}
                  className="mt-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-center"
                >
                  Quitar de Favoritos
                </button>

                <Link
                  href={`/products/${p.id_producto}`}
                  className="mt-3 px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg text-center"
                >
                  Ver Producto
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
