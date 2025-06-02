"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useCart, CartItem } from "../../../context/CartContext";
import { useProductos, Producto } from "../../../hooks/useProductos";
import { useCategorias, Categoria } from "../../../hooks/useCategorias";
import Link from "next/link";
import Image from "next/image";
import decor from "../../../assets/products.png";

export default function CartPage() {
  const { accessToken, role } = useAuth();
  const router = useRouter();

  // Obtener la lista completa de productos (para filtrar)
  const {
    data: productos,
    isLoading: productosLoading,
    error: productosError,
  } = useProductos();

  // Obtener categorías (si queremos mostrar nombre de categoría)
  const {
    data: categorias,
    isLoading: categoriasLoading,
    error: categoriasError,
  } = useCategorias();

  // Contexto del carrito
  const {
    carrito,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // Redirecciones de auth
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

  // Filtrar los productos que estén en carrito
  const productosEnCarrito: (Producto & { cantidad: number })[] = useMemo(() => {
    if (!productos) return [];
    return carrito
      .map((item: CartItem) => {
        const prod = productos.find((p) => p.id_producto === item.id_producto);
        return prod
          ? {
              ...prod,
              cantidad: item.cantidad,
            }
          : null;
      })
      .filter((p): p is Producto & { cantidad: number } => p !== null);
  }, [productos, carrito]);

  // Estados de carga / error
  if (productosLoading || categoriasLoading) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Cargando carrito…</p>
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

  // Calcular total del carrito (sumar precio * cantidad)
  const total = productosEnCarrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FEF5E7] to-[#F2C894]">
      {/* Contenido principal */}
      <main className="flex-1 p-4 sm:p-8">
        <h2 className="text-2xl font-bold text-[#4C2A10] mb-4">Mi Carrito</h2>

        {productosEnCarrito.length === 0 ? (
          <p className="text-[#4C2A10]">No tienes productos en el carrito.</p>
        ) : (
          <div className="space-y-6">
            {productosEnCarrito.map((p) => (
              <div
                key={p.id_producto}
                className="relative bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row gap-4 items-start"
              >
                {/* Imagen decorativa en la parte superior izquierda */}
                <Image
                  src={decor}
                  alt="Decorativo"
                  width={70}
                  height={70}
                  className="absolute top-2 left-2 opacity-90 pointer-events-none"
                />

                {/* Imagen pequeña del producto */}
                <div className="w-full h-full sm:w-1/4 h-32 bg-[#DCD1C1] rounded-lg overflow-hidden flex items-center justify-center">
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

                <div className="flex-1 ml-0 sm:ml-4">
                  {/* Nombre */}
                  <h3 className="text-lg font-semibold text-[#4C2A10] mb-1">
                    {p.nombre}
                  </h3>

                  {/* Precio unitario */}
                  <p className="text-[#7AB800] font-bold mb-1">
                    ${p.precio.toFixed(2)} c/u
                  </p>

                  {/* Categoría */}
                  <p className="text-[#4C2A10] text-sm mb-2 capitalize">
                    <strong>Categoría:</strong>{" "}
                    {categoriaMap[p.id_categoria] || "Desconocida"}
                  </p>

                  {/* Cantidad (con botones + y −) */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => {
                        const nuevaCantidad = p.cantidad - 1;
                        if (nuevaCantidad <= 0) {
                          removeFromCart(p.id_producto);
                        } else {
                          updateQuantity(p.id_producto, nuevaCantidad);
                        }
                      }}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      −
                    </button>
                    <span className="text-[#4C2A10] font-medium">
                      {p.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(p.id_producto, p.cantidad + 1)
                      }
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal por producto */}
                  <p className="text-[#4C2A10] text-sm mb-2">
                    <strong>Subtotal:</strong> $
                    {(p.precio * p.cantidad).toFixed(2)}
                  </p>

                  {/* Botón Quitar del carrito */}
                  <button
                    onClick={() => removeFromCart(p.id_producto)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Quitar del Carrito
                  </button>
                </div>
              </div>
            ))}

            {/* Total general */}
            <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
              <span className="text-xl font-semibold text-[#4C2A10]">
                Total:
              </span>
              <span className="text-xl font-bold text-[#7AB800]">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Botón para proceder al checkout */}
            <div className="text-right">
              <Link
                href="/checkout"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Hacer Pedido
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
