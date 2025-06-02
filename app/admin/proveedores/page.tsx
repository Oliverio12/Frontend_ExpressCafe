"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useProveedores, useEliminarProveedor } from "../../../hooks/useProveedores";

export default function ProveedoresPage() {
  const { data, isLoading, error } = useProveedores();
  const eliminar = useEliminarProveedor();

  const [toDelete, setToDelete] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(p =>
      p.nombre.toLowerCase().includes(q.toLowerCase())
    );
  }, [data, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (isLoading) return <p className="p-4 sm:p-8">Cargando proveedores…</p>;
  if (error)     return <p className="p-4 sm:p-8">Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Proveedores</h1>
        <div className="flex flex-col md:flex-row flex-wrap gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filtrar por nombre…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          />
          <select
            value={pageSize}
            onChange={e => { setPageSize(+e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          >
            {[10,15,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <Link
            href="/admin/proveedores/new"
            className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
          >
            Nuevo Proveedor
          </Link>
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(p => (
          <div key={p.id_proveedor} className="bg-white p-4 rounded-lg shadow space-y-1">
            <p><strong>ID:</strong> {p.id_proveedor}</p>
            <p><strong>Nombre:</strong> {p.nombre}</p>
            <p><strong>Teléfono:</strong> {p.telefono}</p>
            <p><strong>Email:</strong> {p.email}</p>
            <p><strong>Dirección:</strong> {p.direccion}</p>
            <p><strong>Contacto:</strong> {p.contacto}</p>
            <div className="flex space-x-2 mt-2">
              <Link
                href={`/admin/proveedores/${p.id_proveedor}`}
                className="flex-1 text-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Editar
              </Link>
              <button
                onClick={() => setToDelete(p.id_proveedor)}
                className="flex-1 text-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="hidden lg:block">
        <table className="w-full bg-white rounded-lg shadow mb-4 whitespace-nowrap">
          <thead className="bg-[#F2C894] text-[#4C2A10]">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Email</th>
              <th className="p-4">Dirección</th>
              <th className="p-4">Contacto</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id_proveedor} className="border-b last:border-none hover:bg-gray-50">
                <td className="p-4">{p.id_proveedor}</td>
                <td className="p-4">{p.nombre}</td>
                <td className="p-4">{p.telefono}</td>
                <td className="p-4">{p.email}</td>
                <td className="p-4">{p.direccion}</td>
                <td className="p-4">{p.contacto}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <Link
                    href={`/admin/proveedores/${p.id_proveedor}`}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setToDelete(p.id_proveedor)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Borrar
                  </button>
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
          «
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          »
        </button>
      </div>

      {/* Modal */}
      {toDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">¿Eliminar proveedor <strong>#{toDelete}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => { eliminar.mutate(toDelete); setToDelete(null); }}
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
