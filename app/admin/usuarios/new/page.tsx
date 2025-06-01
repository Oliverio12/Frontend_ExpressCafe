// app/(admin)/usuarios/new/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCrearUsuario, NewUsuario } from "../../../../hooks/useUsuarios";
import { useAuth } from "../../../../context/AuthContext";

export default function NuevoUsuarioPage() {
  const { role } = useAuth();
  const crear = useCrearUsuario();
  const router = useRouter();

  useEffect(() => {
    if (role !== 3) router.replace("/admin/usuarios");
  }, [role, router]);

  const [form, setForm] = useState<NewUsuario>({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    id_rol: 2,
  });

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Usuario</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear.mutate(form, {
            onSuccess: () => router.push("/admin/usuarios"),
          });
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm((f) => ({ ...f, nombre: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={(e) =>
            setForm((f) => ({ ...f, apellidos: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={form.id_rol}
          onChange={(e) =>
            setForm((f) => ({ ...f, id_rol: +e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value={2}>Empleado</option>
          <option value={3}>Admin</option>
        </select>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
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
