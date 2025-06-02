"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useClientes, useEliminarCliente } from "../../../hooks/useClientes";

export default function ClientesPage() {
  const { role } = useAuth();
  const { data: clientes, isLoading, error } = useClientes();
  const eliminar = useEliminarCliente();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toDelete, setToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (role !== 3) {
      // si no es admin, podrías redirigir o mostrar mensaje
    }
  }, [role]);

  const filtered = useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(c =>
      [c.nombre, c.apellidos, c.email]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }, [clientes, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (isLoading) return <p className="p-4 sm:p-8">Cargando clientes…</p>;
  if (error)     return <p className="p-4 sm:p-8">Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Clientes</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar nombre, email…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          />
          <select
            value={pageSize}
            onChange={e => { setPageSize(+e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          >
            {[10,15,20,50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Cards para móvil/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(c => (
          <div
            key={c.id_cliente}
            className="bg-white p-4 rounded-lg shadow space-y-1"
          >
            <p><strong>Nombre:</strong> {c.nombre}</p>
            <p><strong>Apellidos:</strong> {c.apellidos}</p>
            <p><strong>Email:</strong> {c.email}</p>
            <p><strong>Registro:</strong> {new Date(c.fecha_registro).toLocaleDateString()}</p>
            <div className="flex space-x-2 mt-2">
              {role === 3 ? (
                <button
                  onClick={() => setToDelete(c.id_cliente)}
                  className="flex-1 text-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Borrar
                </button>
              ) : (
                <span className="text-gray-400 italic">Sin permisos</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla para escritorio grande */}
      <div className="hidden lg:block">
        <table className="w-full bg-white rounded-lg shadow mb-4 whitespace-nowrap">
          <thead className="bg-[#F2C894] text-[#4C2A10]">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Apellidos</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Registro</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(c => (
              <tr
                key={c.id_cliente}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="p-4">{c.nombre}</td>
                <td className="p-4">{c.apellidos}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{new Date(c.fecha_registro).toLocaleDateString()}</td>
                <td className="p-4 flex justify-center space-x-2">
                  {role === 3 ? (
                    <button
                      onClick={() => setToDelete(c.id_cliente)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Borrar
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Sin permisos</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          « Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente »
        </button>
      </div>

      {/* Modal de confirmación */}
      {toDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">
              ¿Eliminar cliente <strong>{toDelete}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => { eliminar.mutate(toDelete!); setToDelete(null); }}
                disabled={eliminar.status === "pending"}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
              >
                {eliminar.status === "pending" ? "Borrando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
