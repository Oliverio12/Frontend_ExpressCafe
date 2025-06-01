// app/(admin)/compras/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCompras, useEliminarCompra } from "../../../hooks/useCompras";
import { useProveedores } from "../../../hooks/useProveedores";

export default function ComprasPage() {
  const { data: compras, isLoading, error } = useCompras();
  const { data: proveedores = [] } = useProveedores();
  const eliminar = useEliminarCompra();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!compras) return [];
    return compras.filter(c => {
      const pr = proveedores.find(p => p.id_proveedor === c.id_proveedor);
      return (`#${c.id_compra} ${pr?.nombre ?? ""}`)
        .toLowerCase()
        .includes(q.toLowerCase());
    });
  }, [compras, proveedores, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  if (isLoading) return <p className="p-4 sm:p-8">Cargando compras…</p>;
  if (error)     return <p className="p-4 sm:p-8">Error: {error.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Compras</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            placeholder="Buscar compra o proveedor…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            className="w-full md:w-auto border px-3 py-2 rounded"
          />
          <select
            value={pageSize}
            onChange={e => { setPageSize(+e.target.value); setPage(1); }}
            className="w-full md:w-auto border px-3 py-2 rounded"
          >
            {[10,15,20,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </header>

      {/* Cards móvil/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(c => {
          const pr = proveedores.find(p => p.id_proveedor === c.id_proveedor)!;
          return (
            <div
              key={c.id_compra}
              className="bg-white p-4 rounded-lg shadow space-y-1"
            >
              <p><strong>#Compra:</strong> #{c.id_compra}</p>
              <p><strong>Proveedor:</strong> {pr.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(c.fecha_compra).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${c.total.toFixed(2)}</p>
              <div className="flex space-x-2 mt-2">
                <Link
                  href={`/admin/compras/${c.id_compra}`}
                  className="flex-1 text-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setToDelete(c.id_compra)}
                  className="flex-1 text-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla escritorio */}
      <div className="hidden lg:block">
        <table className="w-full bg-white rounded-lg shadow mb-4 whitespace-nowrap">
          <thead className="bg-[#F2C894] text-[#4C2A10]">
            <tr>
              <th className="p-4">#Compra</th>
              <th className="p-4">Proveedor</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(c => {
              const pr = proveedores.find(p => p.id_proveedor === c.id_proveedor)!;
              return (
                <tr key={c.id_compra} className="border-b last:border-none hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">#{c.id_compra}</td>
                  <td className="p-4">{pr.nombre}</td>
                  <td className="p-4 whitespace-nowrap">{new Date(c.fecha_compra).toLocaleDateString()}</td>
                  <td className="p-4">${c.total.toFixed(2)}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <Link
                      href={`/admin/compras/${c.id_compra}`}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => setToDelete(c.id_compra)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              );
            })}
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
          « Ant.
        </button>
        <span>Página {page} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sig. »
        </button>
      </div>

      {/* Modal */}
      {toDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">¿Eliminar compra #{toDelete}?</p>
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
