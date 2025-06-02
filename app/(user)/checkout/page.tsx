"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useClientes, Cliente } from "../../../hooks/useClientes";
import { useProductos } from "../../../hooks/useProductos";
import { useCart } from "../../../context/CartContext";
import { useCrearPedido, PedidoItemInput } from "../../../hooks/usePedidos";

export default function CheckoutPage() {
  const { accessToken, role, email } = useAuth();
  const router = useRouter();

  // Hook para obtener todos los clientes
  const {
    data: clientes = [],
    isLoading: clientesLoading,
    error: clientesError,
  } = useClientes();

  // Hook para obtener todos los productos
  const {
    data: productos = [],
    isLoading: productosLoading,
    error: productosError,
  } = useProductos();

  // Contexto de carrito
  const { carrito, removeFromCart } = useCart();

  // Hook para crear pedido
  const crearPedido = useCrearPedido();

  // Estado local para el id_cliente hallado por email
  const [idCliente, setIdCliente] = useState<number | null>(null);
  const [clienteNotFound, setClienteNotFound] = useState(false);

  // Al cargar la lista de clientes, buscamos por email
  useEffect(() => {
    if (clientesLoading) return;
    if (!email) {
      setClienteNotFound(true);
      return;
    }
    const cli: Cliente | undefined = clientes.find((c) => c.email === email);
    if (cli) {
      setIdCliente(cli.id_cliente);
    } else {
      setClienteNotFound(true);
    }
  }, [clientes, clientesLoading, email]);

  // Redirección según autenticación/rol
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

  // Construir los items del pedido a partir del carrito
  const items: PedidoItemInput[] = useMemo(() => {
    return carrito.map((item) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
    }));
  }, [carrito]);

  // Calcular total (clientes a modo de confirmación visual)
  const totalCalculado: number = useMemo(() => {
    return carrito.reduce((acc, item) => {
      const prod = productos.find((p) => p.id_producto === item.id_producto);
      return prod ? acc + prod.precio * item.cantidad : acc;
    }, 0);
  }, [carrito, productos]);

  const handleConfirmar = async () => {
    if (idCliente === null || items.length === 0) return;
    try {
      await crearPedido.mutateAsync(
        { id_cliente: idCliente, items },
        {
          onSuccess: () => {
            // Vaciar carrito tras crear pedido
            carrito.forEach((item) => removeFromCart(item.id_producto));
            router.push("/orders"); // Ajusta según tu ruta de “mis pedidos”
          },
        }
      );
    } catch {
      // React Query manejará el error
    }
  };

  // Estados de carga/errores
  if (clientesLoading || productosLoading) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Cargando información de checkout…</p>
      </div>
    );
  }
  if (clientesError) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error al cargar datos de cliente.</p>
      </div>
    );
  }
  if (productosError) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error al cargar datos de productos.</p>
      </div>
    );
  }
  if (clienteNotFound) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          No se encontró tu usuario en clientes. Contacta soporte.
        </p>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10]">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] flex flex-col">
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-[#4C2A10]">Confirmar Pedido</h1>

          {/* Lista de ítems con subtotales */}
          <div className="space-y-4">
            {items.map((item) => {
              const prod = productos.find((p) => p.id_producto === item.id_producto);
              if (!prod) return null;
              return (
                <div
                  key={prod.id_producto}
                  className="flex justify-between items-center"
                >
                  <span className="flex-1 text-[#4C2A10]">
                    {prod.nombre} (x{item.cantidad})
                  </span>
                  <span className="text-[#7AB800]">
                    ${(prod.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total general */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-semibold text-[#4C2A10]">Total:</span>
            <span className="text-lg font-bold text-[#7AB800]">
              ${totalCalculado.toFixed(2)}
            </span>
          </div>

          {/* Botones para cancelar o confirmar */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Volver
            </button>
            <button
              onClick={handleConfirmar}
              disabled={crearPedido.status === "pending"}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
            >
              {crearPedido.status === "pending"
                ? "Procesando…"
                : "Confirmar Pedido"}
            </button>
          </div>

          {crearPedido.status === "error" && (
            <p className="text-red-500">
              Error al crear el pedido. Intenta nuevamente.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
