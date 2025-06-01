"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductos, useActualizarProducto, Producto } from "../../../../hooks/useProductos";

export default function EditProductoPage() {
  const { id } = useParams();
  const pid = Number(id);
  const { data } = useProductos();
  const prod = data?.find(x => x.id_producto === pid);
  const actualizar = useActualizarProducto();
  const router = useRouter();

  const [form, setForm] = useState<Producto>({
    id_producto: pid,
    nombre: "",
    descripcion: null,
    precio: 0,
    id_categoria: 1,
    disponible: true,
    imagen_url: null,
  });

  useEffect(() => {
    if (prod) setForm(prod);
  }, [prod]);

  if (!prod) return <p className="p-8">Cargando…</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <form onSubmit={e => {
        e.preventDefault();
        actualizar.mutate(form, {
          onSuccess: () => router.push("/admin/productos"),
        });
      }} className="space-y-4">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.descripcion || ""}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={e => setForm(f => ({ ...f, precio: parseFloat(e.target.value) }))}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          placeholder="URL imagen"
          value={form.imagen_url || ""}
          onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >Cancelar</button>
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
