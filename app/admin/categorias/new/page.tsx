// app/(admin)/categorias/new/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCrearCategoria } from "../../../../hooks/useCategorias";

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const crear = useCrearCategoria();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crear.mutateAsync({ nombre, descripcion: descripcion || null });
    router.push("/admin/categorias");
  };

  const handleCancel = () => {
    router.push("/admin/categorias");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#4C2A10] mb-6">
        Nueva Categoría
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={crear.status === "pending"}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            {crear.status === "pending" ? "Creando…" : "Crear"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
