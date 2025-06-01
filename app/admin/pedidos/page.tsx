// app/(admin)/pedidos/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePedidos, useEliminarPedido } from "../../../hooks/usePedidos";
import { useAuth } from "../../../context/AuthContext";

export default function PedidosPage() {
  const { role } = useAuth();
  const { data, isLoading, error } = usePedidos();
  const eliminar = useEliminarPedido();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(p =>
      `${p.id_pedido} ${p.id_cliente}`.includes(q)
    );
  }, [data, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (isLoading) return <p className="p-4 sm:p-8">Cargando pedidos…</p>;
  if (error)     return <p className="p-4 sm:p-8">Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Pedidos</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filtrar por pedido o cliente…"
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
          {role === 3 && (
            <Link
              href="/admin/pedidos/new"
              className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              Nuevo Pedido
            </Link>
          )}
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(p => (
          <div key={p.id_pedido} className="bg-white p-4 rounded-lg shadow space-y-1">
            <p><strong>#Pedido:</strong> {p.id_pedido}</p>
            <p><strong>Cliente:</strong> {p.id_cliente}</p>
            <p><strong>Fecha:</strong> {new Date(p.fecha_pedido).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> {p.estado_pedido}</p>
            <p><strong>Total:</strong> ${p.total.toFixed(2)}</p>
            <div className="flex space-x-2 mt-2">
              <Link
                href={`/admin/pedidos/${p.id_pedido}`}
                className="flex-1 text-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Ver / Editar
              </Link>
              <button
                onClick={() => setToDelete(p.id_pedido)}
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
              <th className="p-4">#Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id_pedido} className="border-b last:border-none hover:bg-gray-50">
                <td className="p-4">{p.id_pedido}</td>
                <td className="p-4">{p.id_cliente}</td>
                <td className="p-4">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                <td className="p-4 capitalize">{p.estado_pedido}</td>
                <td className="p-4">${p.total.toFixed(2)}</td>
                <td className="p-4 flex justify-center space-x-2">
                  <Link
                    href={`/admin/pedidos/${p.id_pedido}`}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Ver / Editar
                  </Link>
                  <button
                    onClick={() => setToDelete(p.id_pedido)}
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
          « Anterior
        </button>
        <span>Página {page} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente »
        </button>
      </div>

      {/* Modal */}
      {toDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">¿Eliminar el pedido <strong>#{toDelete}</strong>?</p>
            <div className="flex justify-end gap-4">
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
