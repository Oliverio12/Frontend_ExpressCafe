"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCrearCompraItem } from "../../../../hooks/useCompraItems";
import { useCompras } from "../../../../hooks/useCompras";
import { useInventario } from "../../../../hooks/useInventario";

export default function NewCompraItemPage() {
  const crear = useCrearCompraItem();
  const { data: compras = [], isLoading: cl } = useCompras();
  const { data: inventario = [], isLoading: il } = useInventario();
  const router = useRouter();

  const [form, setForm] = useState({
    id_compra: compras[0]?.id_compra ?? 0,
    id_insumo: inventario[0]?.id_insumo ?? 0,
    cantidad: 1,
    precio_unit: 0,
  });

  if (cl || il) return <p className="p-8">Cargando…</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crear.mutateAsync(form);
    router.push("/admin/compra-items");
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Item de Compra</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Compra</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.id_compra}
            onChange={e => setForm(f => ({ ...f, id_compra: +e.target.value }))}
          >
            {compras.map(c => (
              <option key={c.id_compra} value={c.id_compra}>
                #{c.id_compra} – {new Date(c.fecha_compra).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Insumo</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.id_insumo}
            onChange={e => setForm(f => ({ ...f, id_insumo: +e.target.value }))}
          >
            {inventario.map(i => (
              <option key={i.id_insumo} value={i.id_insumo}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            min="1"
            className="w-full border px-3 py-2 rounded"
            value={form.cantidad}
            onChange={e => setForm(f => ({ ...f, cantidad: +e.target.value }))}
          />
        </div>
        <div>
          <label>Precio Unit.</label>
          <input
            type="number"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
            value={form.precio_unit}
            onChange={e => setForm(f => ({ ...f, precio_unit: +e.target.value }))}
          />
        </div>
        <div className="flex justify-between">
          <button onClick={() => router.back()} type="button"
            className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button
            type="submit"
            disabled={crear.status==="pending"}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {crear.status==="pending" ? "Guardando…" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
