"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useInventario, useActualizarInsumo } from "../../../../hooks/useInventario";

export default function EditarInsumoPage() {
  const { id } = useParams<{ id: string }>();
  const { data: insumos, isLoading } = useInventario();
  const actualizar = useActualizarInsumo();
  const router = useRouter();

  const insumo = insumos?.find(i => i.id_insumo === Number(id));
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [unidad, setUnidad] = useState("");

  useEffect(() => {
    if (insumo) {
      setNombre(insumo.nombre);
      setDescripcion(insumo.descripcion || "");
      setCantidad(insumo.cantidad_disp);
      setUnidad(insumo.unidad_medida);
    }
  }, [insumo]);

  if (isLoading) return <p className="p-8">Cargando…</p>;
  if (!insumo) return <p className="p-8">Insumo no encontrado.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actualizar.mutateAsync({
      id_insumo: insumo.id_insumo,
      nombre,
      descripcion,
      cantidad_disp: cantidad,
      unidad_medida: unidad,
    });
    router.push("/admin/inventario");
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Insumo #{insumo.id_insumo}</h1>
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
            disabled={actualizar.status === "pending"}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {actualizar.status === "pending" ? "Actualizando…" : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}
