// app/(admin)/roles/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import { useRoles } from "../../../hooks/useRoles";

export default function RolesPage() {
  const { data, isLoading, error } = useRoles();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(r =>
      r.nombre_rol.toLowerCase().includes(q.toLowerCase())
    );
  }, [data, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (isLoading) return <p className="p-4 sm:p-8">Cargando roles…</p>;
  if (error)     return <p className="p-4 sm:p-8">Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Roles</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar rol…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          />
          <select
            value={pageSize}
            onChange={e => { setPageSize(+e.target.value); setPage(1); }}
            className="w-full md:w-auto px-3 py-2 border rounded"
          >
            {[5,10,15,20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(r => (
          <div key={r.id_rol} className="bg-white p-4 rounded-lg shadow space-y-1">
            <p><strong>ID:</strong> {r.id_rol}</p>
            <p><strong>Rol:</strong> {r.nombre_rol}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="hidden lg:block">
        <table className="w-full bg-white rounded-lg shadow mb-4 whitespace-nowrap">
          <thead className="bg-[#F2C894] text-[#4C2A10]">
            <tr>
              <th className="p-4 text-center">ID</th>
              <th className="p-4 text-center">Rol</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(r => (
              <tr key={r.id_rol} className="border-b last:border-none hover:bg-gray-50">
                <td className="p-4 text-center">{r.id_rol}</td>
                <td className="p-4 text-center">{r.nombre_rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          « Anterior
        </button>
        <span>{page} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente »
        </button>
      </div>
    </div>
);
}
