// app/(admin)/proveedores/new/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCrearProveedor } from "../../../../hooks/useProveedores";

export default function NuevoProveedorPage() {
  const crear = useCrearProveedor();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contacto, setContacto] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await crear.mutateAsync({
      nombre,
      telefono,
      email,
      direccion,
      contacto,
    });
    router.push("/admin/proveedores");
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Proveedor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Dirección</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Contacto</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
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
