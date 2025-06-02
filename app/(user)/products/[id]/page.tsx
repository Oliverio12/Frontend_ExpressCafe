"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import { useProductos, Producto } from "../../../../hooks/useProductos";
import { useCategorias, Categoria } from "../../../../hooks/useCategorias";

import { useFavorites } from "../../../../context/FavoritesContext";
import { useCart } from "../../../../context/CartContext";

import Link from "next/link";

export default function ProductDetailsPage() {
  const { accessToken, role } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // Hooks para productos y categorías
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

  // Mapa id_categoria → nombre_categoria
  const categoriaMap = useMemo<Record<number, string>>(() => {
    if (!categorias) return {};
    return categorias.reduce((map, cat: Categoria) => {
      map[cat.id_categoria] = cat.nombre;
      return map;
    }, {} as Record<number, string>);
  }, [categorias]);

  // Encontrar el producto actual
  const producto: Producto | undefined = useMemo(() => {
    if (!productos) return undefined;
    const pid = Number(id);
    return productos.find((p) => p.id_producto === pid);
  }, [productos, id]);

  // Contextos de favoritos y carrito
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart, getQuantity } = useCart();

  // Mensaje de feedback (tipo y texto)
  const [message, setMessage] = useState<{
    type: "fav" | "cart";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Redirecciones de auth
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role !== 1) {
      router.replace("/admin");
      return;
    }
  }, [accessToken, role, router]);

  // Estados de carga / error
  if (productosLoading || categoriasLoading) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Cargando detalles del producto…</p>
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
  if (!producto) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Producto no encontrado.</p>
        <Link
          href="/products"
          className="mt-4 inline-block px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg"
        >
          Volver a Productos
        </Link>
      </div>
    );
  }

  // Handler para alternar favorito (muestra mensaje, no redirige)
  const handleToggleFavorite = () => {
    if (isFavorite(producto.id_producto)) {
      removeFavorite(producto.id_producto);
      setMessage({ type: "fav", text: "Producto eliminado de Favoritos" });
    } else {
      addFavorite(producto.id_producto);
      setMessage({ type: "fav", text: "Producto agregado a Favoritos" });
    }
    // Limpiar mensaje luego de 3 segundos
    setTimeout(() => {
      setMessage(null);
    }, 10000);
  };

  // Handler para agregar al carrito (muestra mensaje, no redirige)
  const handleAddToCart = () => {
    const cantidadActual = getQuantity(producto.id_producto);
    addToCart(producto.id_producto, 1);
    setMessage({
      type: "cart",
      text:
        cantidadActual > 0
          ? "Cantidad actualizada en el Carrito"
          : "Producto agregado al Carrito",
    });
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] flex flex-col">
     

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-[#4C2A10] mb-6">
            Detalles del Producto
          </h1>

          {/* Imagen grande */}
          <div className="w-full h-64 bg-[#DCD1C1] rounded-lg mb-6 overflow-hidden flex items-center justify-center">
            {producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-[#4C2A10]">Sin imagen</span>
            )}
          </div>

          {/* Nombre */}
          <h2 className="text-2xl font-semibold text-[#4C2A10] mb-4">
            {producto.nombre}
          </h2>

          {/* Descripción */}
          {producto.descripcion && (
            <p className="text-gray-600 mb-4">{producto.descripcion}</p>
          )}

          {/* Precio */}
          <p className="text-[#7AB800] font-bold text-xl mb-4">
            ${producto.precio.toFixed(2)}
          </p>

          {/* Categoría */}
          <p className="text-[#4C2A10] text-sm mb-2 capitalize">
            <strong>Categoría:</strong>{" "}
            {categoriaMap[producto.id_categoria] || "Desconocida"}
          </p>

          {/* Disponible */}
          <p className="text-[#4C2A10] text-sm mb-6 capitalize">
            <strong>Disponible:</strong> {producto.disponible ? "Sí" : "No"}
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Botón Favoritos */}
            <button
              onClick={handleToggleFavorite}
              className={`w-full sm:w-auto inline-block px-4 py-2 text-white rounded-lg text-center ${
                isFavorite(producto.id_producto)
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-[#E27A3F] hover:bg-[#D4722E]"
              }`}
            >
              {isFavorite(producto.id_producto)
                ? "Quitar de Favoritos"
                : "Agregar a Favoritos"}
            </button>

            {/* Botón Carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto inline-block px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg text-center"
            >
              {getQuantity(producto.id_producto) > 0
                ? `En Carrito (${getQuantity(producto.id_producto)})`
                : "Agregar al Carrito"}
            </button>
          </div>

          {/* Mensaje de éxito + enlaces extra */}
          {message && (
            <div className="mb-4 space-y-2">
              <p
                className={`text-lg font-medium ${
                  message.type === "fav" ? "text-[#E27A3F]" : "text-[#7AB800]"
                }`}
              >
                {message.text}
              </p>

              {/* Enlaces opcionales dependiendo del tipo */}
              {message.type === "fav" && (
                <Link
                  href="/favorites"
                  className="inline-block px-4 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg"
                >
                  Ir a ver mis Favoritos
                </Link>
              )}
              {message.type === "cart" && (
                <Link
                  href="/cart"
                  className="inline-block px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg"
                >
                  Ir a ver mi Carrito
                </Link>
              )}
            </div>
          )}

          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-[#7AB800] hover:bg-[#6DA000] text-white rounded-lg"
          >
            ← Volver a Productos
          </Link>
        </div>
      </main>
    </div>
  );
}