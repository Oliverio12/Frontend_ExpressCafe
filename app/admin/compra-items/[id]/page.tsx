"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useCompraItem,
  useActualizarCompraItem,
} from "../../../../hooks/useCompraItems";
import { useCompras } from "../../../../hooks/useCompras";
import { useInventario } from "../../../../hooks/useInventario";

export default function EditCompraItemPage() {
  const { id } = useParams();
  const did = Number(id);
  const { data: item, isLoading } = useCompraItem(did);
  const { data: compras = [], isLoading: cl } = useCompras();
  const { data: inventario = [], isLoading: il } = useInventario();
  const actualizar = useActualizarCompraItem();
  const router = useRouter();

  const [form, setForm] = useState({
    id_detalle: did,
    id_compra: 0,
    id_insumo: 0,
    cantidad: 0,
    precio_unit: 0,
  });

  useEffect(() => {
    if (item) {
      setForm({
        id_detalle: item.id_detalle,
        id_compra: item.id_compra,
        id_insumo: item.id_insumo,
        cantidad: item.cantidad,
        precio_unit: item.precio_unit,
      });
    }
  }, [item]);

  if (isLoading || cl || il) return <p className="p-8">Cargando…</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizar.mutate(form, {
      onSuccess: () => router.push("/admin/compra-items"),
    });
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Item de Compra</h1>
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
