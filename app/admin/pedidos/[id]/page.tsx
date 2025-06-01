"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  usePedido,
  useActualizarPedido,
  Pedido
} from "../../../../hooks/usePedidos";

export default function EditPedidoPage() {
  const { id } = useParams();
  const pid = Number(id);
  const { data, isLoading } = usePedido(pid);
  const actualizar = useActualizarPedido();
  const router = useRouter();

  const [form, setForm] = useState<Pedido>({
    id_pedido: pid,
    id_cliente: 0,
    fecha_pedido: "",
    estado_pedido: "pendiente",
    total: 0
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading) return <p className="p-8">Cargando pedido…</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Pedido #{pid}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          actualizar.mutate(form, { onSuccess: () => router.push("/admin/pedidos") });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">Estado</label>
          <select
            value={form.estado_pedido}
            onChange={e => setForm(f => ({ ...f, estado_pedido: e.target.value as any }))}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="pendiente">pendiente</option>
            <option value="procesando">procesando</option>
            <option value="listo">listo</option>
            <option value="cancelado">cancelado</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Total</label>
          <input
            type="number"
            step="0.01"
            value={form.total}
            onChange={e => setForm(f => ({ ...f, total: +e.target.value }))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={actualizar.status==="pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {actualizar.status==="pending" ? "Guardando…" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
