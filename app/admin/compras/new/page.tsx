"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCrearCompra } from "../../../../hooks/useCompras";
import { useProveedores } from "../../../../hooks/useProveedores";

export default function NewCompraPage() {
  const crear = useCrearCompra();
  const { data: proveedores = [], isLoading } = useProveedores();
  const router = useRouter();

  const [idProveedor, setIdProveedor] = useState<number | "">("");
  const [total, setTotal] = useState<number>(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idProveedor === "") return;
    await crear.mutateAsync({ id_proveedor: idProveedor, total });
    router.push("/admin/compras");
  };

  if (isLoading) return <p className="p-8">Cargando…</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nueva Compra</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label>Proveedor</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={idProveedor}
            onChange={e => setIdProveedor(Number(e.target.value))}
            required
          >
            <option value="">— Selecciona uno —</option>
            {proveedores.map(p => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Total</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
            value={total}
            onChange={e => setTotal(Number(e.target.value))}
            required
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
