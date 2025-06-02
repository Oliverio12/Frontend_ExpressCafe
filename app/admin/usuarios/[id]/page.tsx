"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useUsuario,
  useActualizarUsuario,
  UpdateUsuario,
} from "../../../../hooks/useUsuarios";
import { useAuth } from "../../../../context/AuthContext";

export default function EditarUsuarioPage() {
  const { role } = useAuth();
  const { id } = useParams();
  const uid = Number(id);
  const { data: user, isLoading } = useUsuario(uid);
  const actualizar = useActualizarUsuario();
  const router = useRouter();

  useEffect(() => {
    if (role !== 3) router.replace("/admin/usuarios");
  }, [role, router]);

  const [form, setForm] = useState<UpdateUsuario>({
    id_usuario: uid,
    nombre: "",
    apellidos: "",
    email: "",
    id_rol: 2,
  });

  useEffect(() => {
    if (user) {
      setForm({
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        id_rol: user.id_rol,
      });
    }
  }, [user]);

  if (isLoading) return <p className="p-8">Cargando usuario…</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Usuario</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizar.mutate(form, {
            onSuccess: () => router.push("/admin/usuarios"),
          });
        }}
        className="space-y-4"
      >
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm((f) => ({ ...f, nombre: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
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
