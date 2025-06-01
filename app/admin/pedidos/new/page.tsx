"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCrearPedido } from "../../../../hooks/usePedidos";
import { useClientes } from "../../../../hooks/useClientes";
import { useProductos } from "../../../../hooks/useProductos";

export default function NuevoPedidoPage() {
  const router = useRouter();
  const { data: clientes = [], isLoading: cLoad } = useClientes();
  const { data: productos = [], isLoading: pLoad } = useProductos();
  const crear = useCrearPedido();

  const [idCliente, setIdCliente] = useState<number | "">("");
  const [lineas, setLineas] = useState<
    Array<{ id_producto: number; cantidad: number }>
  >([]);

  // Añadir una nueva línea vacía
  const addLinea = () =>
    setLineas((ls) => [...ls, { id_producto: productos[0]?.id_producto || 0, cantidad: 1 }]);

  // Modificar línea
  const updateLinea = (idx: number, field: "id_producto" | "cantidad", val: number) => {
    setLineas((ls) =>
      ls.map((l, i) => (i === idx ? { ...l, [field]: val } : l))
    );
  };

  // Quitar línea
  const removeLinea = (idx: number) =>
    setLineas((ls) => ls.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idCliente === "" || lineas.length === 0) return;
    await crear.mutateAsync(
      { id_cliente: idCliente, items: lineas },
      { onSuccess: () => router.push("/admin/pedidos") }
    );
  };

  if (cLoad || pLoad) return <p className="p-8">Cargando…</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Pedido</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cliente */}
        <div>
          <label className="block mb-1">Cliente</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={idCliente}
            onChange={(e) => setIdCliente(Number(e.target.value))}
            required
          >
            <option value="">— Selecciona un cliente —</option>
            {clientes.map((c) => (
              <option key={c.id_cliente} value={c.id_cliente}>
                {c.nombre} {c.apellidos} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Líneas */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <strong>Productos</strong>
            <button
              type="button"
              onClick={addLinea}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Añadir línea
            </button>
          </div>

          {lineas.map((l, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select
                className="flex-1 border px-2 py-1 rounded"
                value={l.id_producto}
                onChange={(e) =>
                  updateLinea(i, "id_producto", Number(e.target.value))
                }
              >
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre} — ${Number(p.precio).toFixed(2)}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                className="w-20 border px-2 py-1 rounded"
                value={l.cantidad}
                onChange={(e) =>
                  updateLinea(i, "cantidad", Number(e.target.value))
                }
              />

              <button
                type="button"
                onClick={() => removeLinea(i)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={crear.status === "pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {crear.status === "pending" ? "Creando…" : "Crear Pedido"}
          </button>
        </div>
      </form>
    </div>
  );
}
