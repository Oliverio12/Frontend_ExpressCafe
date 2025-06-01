"use client";
import React, { useState } from "react";
import { useCrearInsumo } from "../../../../hooks/useInventario";
import { useRouter } from "next/navigation";

export default function NuevoInsumoPage() {
  const crear = useCrearInsumo();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [unidad, setUnidad] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crear.mutateAsync({
      nombre,
      descripcion,
      cantidad_disp: cantidad,
      unidad_medida: unidad,
    });
    router.push("/admin/inventario");
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Insumo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Cantidad Disponible</label>
          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Unidad de Medida</label>
          <input
            value={unidad}
            onChange={e => setUnidad(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={crear.status === "pending"}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {crear.status === "pending" ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
