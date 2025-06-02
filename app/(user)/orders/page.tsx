"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useClientes, Cliente } from "../../../hooks/useClientes";
import { usePedidos, Pedido } from "../../../hooks/usePedidos";
import Link from "next/link";

export default function OrdersPage() {
  const { accessToken, role, email } = useAuth();
  const router = useRouter();

  // Obtener todos los clientes
  const {
    data: clientes = [],
    isLoading: clientesLoading,
    error: clientesError,
  } = useClientes();

  // Obtener todos los pedidos
  const {
    data: pedidos = [],
    isLoading: pedidosLoading,
    error: pedidosError,
  } = usePedidos();

  // Estado local para id_cliente
  const [idCliente, setIdCliente] = useState<number | null>(null);
  const [clienteNotFound, setClienteNotFound] = useState(false);

  // Al cargar clientes, buscar nuestro registro por email
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

  // Redirección si no autenticado o rol distinto de 1
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

  // Filtrar pedidos que pertenezcan a este cliente
  const misPedidos: Pedido[] = useMemo(() => {
    if (idCliente === null) return [];
    return pedidos.filter((p) => p.id_cliente === idCliente);
  }, [pedidos, idCliente]);

  // Formatear fecha a "DD de mes de YYYY"
  const formatoFecha = (fechaStr: string): string => {
    try {
      const date = new Date(fechaStr);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  // Estados de carga / error
  if (clientesLoading || pedidosLoading) {
    return (
      <div className="p-8">
        <p className="text-[#4C2A10] animate-pulse">
          Cargando mis pedidos…
        </p>
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
  if (pedidosError) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error al cargar pedidos.</p>
      </div>
    );
  }
  if (clienteNotFound) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          No se encontró tu usuario en la lista de clientes. Contacta soporte.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF5E7] to-[#F2C894] flex flex-col">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#4C2A10] mb-6">
          Mis Pedidos
        </h1>

        {misPedidos.length === 0 ? (
          <p className="text-[#4C2A10]">No tienes pedidos realizados.</p>
        ) : (
          <div className="space-y-4">
            {misPedidos
              .slice()
              .sort((a, b) => new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime())
              .map((pedido) => (
                <div
                  key={pedido.id_pedido}
                  className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-[#4C2A10] font-medium">
                      Pedido #{pedido.id_pedido}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Fecha: {formatoFecha(pedido.fecha_pedido)}
                    </p>
                    <p className="capitalize text-[#7AB800] font-semibold">
                      Estado: {pedido.estado_pedido}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="text-lg font-bold text-[#4C2A10]">
                      Total: ${pedido.total.toFixed(2)}
                    </span>
                    {/* Aquí podrías agregar un Link a detalles de pedido si existe esa ruta */}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
