// app/(admin)/categorias/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../services/api";
import { useActualizarCategoria } from "../../../../hooks/useCategorias";

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const router = useRouter();
  const actualizar = useActualizarCategoria();

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState<string>("");

  useEffect(() => {
    api
      .get<Categoria>(`/categorias/${id}`)
      .then((res) => {
        setCategoria(res.data);
        setNombre(res.data.nombre);
        setDescripcion(res.data.descripcion || "");
      })
      .catch(() => router.push("/admin/categorias"));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria) return;
    await actualizar.mutateAsync({
      id_categoria: categoria.id_categoria,
      nombre,
      descripcion: descripcion || null,
    });
    router.push("/admin/categorias");
  };

  const handleCancel = () => {
    router.push("/admin/categorias");
  };

  if (!categoria) return <p className="p-8">Cargando…</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#4C2A10] mb-6">
        Editar Categoría
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
            disabled={actualizar.status === "pending"}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {actualizar.status === "pending" ? "Actualizando…" : "Guardar cambios"}
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
