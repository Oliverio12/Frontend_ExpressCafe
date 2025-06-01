"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCompra, useActualizarCompra } from "../../../../hooks/useCompras";
import { useProveedores } from "../../../../hooks/useProveedores";

export default function EditCompraPage() {
  const { id } = useParams();
  const cid = Number(id);
  const { data: compra, isLoading } = useCompra(cid);
  const { data: proveedores = [] } = useProveedores();
  const actualizar = useActualizarCompra();
  const router = useRouter();

  const [form, setForm] = useState({
    id_compra: cid,
    id_proveedor: 0,
    fecha_compra: "",
    total: 0,
  });

  useEffect(() => {
    if (compra) {
      setForm({
        id_compra: compra.id_compra,
        id_proveedor: compra.id_proveedor,
        fecha_compra: compra.fecha_compra,
        total: compra.total,
      });
    }
  }, [compra]);

  if (isLoading) return <p className="p-8">Cargando…</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizar.mutate(form, {
      onSuccess: () => router.push("/admin/compras")
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Compra</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Proveedor</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.id_proveedor}
            onChange={e => setForm(f => ({ ...f, id_proveedor: +e.target.value }))}
          >
            {proveedores.map(p => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha Compra</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={form.fecha_compra.split("T")[0]}
            onChange={e => setForm(f => ({ ...f, fecha_compra: e.target.value }))}
          />
        </div>
        <div>
          <label>Total</label>
          <input
            type="number"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
            value={form.total}
            onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))}
          />
        </div>
        <div className="flex justify-between">
          <button onClick={() => router.back()} type="button"
            className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button
            type="submit"
            disabled={actualizar.status==="pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {actualizar.status==="pending" ? "Guardando…" : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}
