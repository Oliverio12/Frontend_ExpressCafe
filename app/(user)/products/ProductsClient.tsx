"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import decor from "../../../assets/products.png";
import Link from "next/link";

import { useProductos, Producto } from "../../../hooks/useProductos";
import { useCategorias, Categoria } from "../../../hooks/useCategorias";

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Leer parámetros iniciales de URL
  const paramSearch = searchParams.get("search") ?? "";
  const paramCategory = searchParams.get("category") ?? "";

  // Estados para filtros (inicializados desde la URL)
  const [searchQuery, setSearchQuery] = useState<string>(paramSearch);
  const [selectedCategoria, setSelectedCategoria] = useState<number | "">(
    paramCategory === "" ? "" : Number(paramCategory)
  );

  // Obtener todos los productos
  const {
    data: productos,
    isLoading: productosLoading,
    error: productosError,
  } = useProductos();

  // Obtener todas las categorías
  const {
    data: categorias,
    isLoading: categoriasLoading,
    error: categoriasError,
  } = useCategorias();

  // Mapa id_categoria → nombre_categoria
  const categoriaMap = useMemo<Record<number, string>>(() => {
    if (!categorias) return {};
    return categorias.reduce((map, cat: Categoria) => {
      map[cat.id_categoria] = cat.nombre;
      return map;
    }, {} as Record<number, string>);
  }, [categorias]);

  // Filtrar productos por nombre y categoría
  const productosFiltrados = useMemo<Producto[]>(() => {
    if (!productos) return [];
    return productos.filter((p) => {
      const matchesName = p.nombre
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategoria === "" || p.id_categoria === selectedCategoria;
      return matchesName && matchesCategory;
    });
  }, [productos, searchQuery, selectedCategoria]);

  // Al cambiar los filtros, actualizar la URL para persistir estado
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedCategoria !== "") {
      params.set("category", String(selectedCategoria));
    }
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", {
      scroll: false,
    });
  }, [searchQuery, selectedCategoria, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FEF5E7] to-[#F2C894]">
      <main className="flex-1 p-4 sm:p-8">
        <h2 className="text-2xl font-bold text-[#4C2A10] mb-4">
          Todos los Productos
        </h2>

        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Filtro por nombre */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 border border-[#DCD1C1] rounded-lg focus:ring-2 focus:ring-[#E27A3F] outline-none"
          />

          {/* Filtro por categoría */}
          <select
            value={selectedCategoria}
            onChange={(e) =>
              setSelectedCategoria(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full sm:w-1/4 px-4 py-2 border border-[#DCD1C1] rounded-lg focus:ring-2 focus:ring-[#E27A3F] outline-none"
          >
            <option value="">Todas las categorías</option>
            {categorias?.map((cat: Categoria) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estados de carga/errores */}
        {productosLoading || categoriasLoading ? (
          <p className="text-[#4C2A10]">Cargando productos...</p>
        ) : productosError ? (
          <p className="text-red-500">Error al cargar productos.</p>
        ) : categoriasError ? (
          <p className="text-red-500">Error al cargar categorías.</p>
        ) : productosFiltrados.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFiltrados.map((p: Producto) => (
              <div
                key={p.id_producto}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col"
              >
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
                  <p className="text-gray-600 text-sm mb-2">
                    {p.descripcion}
                  </p>
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

                <Link
                  href={`/products/${p.id_producto}`}
                  className="mt-auto px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg text-center"
                >
                  Ver Detalles
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#4C2A10]">No hay productos que mostrar.</p>
        )}
      </main>
    </div>
  );
}
