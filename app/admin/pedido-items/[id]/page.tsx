"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  usePedidoItem,
  useActualizarPedidoItem,
} from "../../../../hooks/usePedidoItems";
import { usePedidos } from "../../../../hooks/usePedidos";
import { useProductos } from "../../../../hooks/useProductos";

export default function EditPedidoItemPage() {
  const { id } = useParams();
  const detaId = Number(id);
  const { data, isLoading: itemLoad } = usePedidoItem(detaId);
  const { data: pedidos = [], isLoading: pLoad } = usePedidos();
  const { data: productos = [], isLoading: prLoad } = useProductos();
  const actualizar = useActualizarPedidoItem();
  const router = useRouter();

  const [form, setForm] = useState({
    id_detalle: detaId,
    id_pedido: 0,
    id_producto: 0,
    cantidad: 1,
    precio_unit: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        id_detalle: data.id_detalle,
        id_pedido: data.id_pedido,
        id_producto: data.id_producto,
        cantidad: data.cantidad,
        precio_unit: data.precio_unit,
      });
    }
  }, [data]);

  if (itemLoad || pLoad || prLoad) return <p className="p-8">Cargando…</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Detalle de Pedido</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          actualizar.mutate(form, {
            onSuccess: () => router.push("/admin/pedido-items"),
          });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">Pedido</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.id_pedido}
            onChange={e =>
              setForm(f => ({ ...f, id_pedido: +e.target.value }))
            }
          >
            {pedidos.map(p => (
              <option key={p.id_pedido} value={p.id_pedido}>
                #{p.id_pedido} — {new Date(p.fecha_pedido).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Producto</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.id_producto}
            onChange={e =>
              setForm(f => ({ ...f, id_producto: +e.target.value }))
            }
          >
            {productos.map(p => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombre} — ${p.precio.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Cantidad</label>
          <input
            type="number"
            min="1"
            className="w-full border px-3 py-2 rounded"
            value={form.cantidad}
            onChange={e =>
              setForm(f => ({ ...f, cantidad: +e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1">Precio Unitario</label>
          <input
            type="number"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
            value={form.precio_unit}
            onChange={e =>
              setForm(f => ({ ...f, precio_unit: +e.target.value }))
            }
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={actualizar.status === "pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {actualizar.status === "pending" ? "Guardando…" : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}
