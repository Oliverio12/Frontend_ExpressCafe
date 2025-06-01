"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCrearProducto, Producto } from "../../../../hooks/useProductos";

export default function NewProductoPage() {
  const crear = useCrearProducto();
  const router = useRouter();

  const [form, setForm] = useState<Omit<Producto, "id_producto">>({
    nombre: "",
    descripcion: "",
    precio: 0,
    id_categoria: 1,
    disponible: true,
    imagen_url: "",
  });

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      <form onSubmit={e => {
        e.preventDefault();
        crear.mutate(form, {
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
            disabled={crear.status === "pending"}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {crear.status === "pending" ? "Guardando…" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
