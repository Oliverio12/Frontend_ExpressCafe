// app/(admin)/pedido-items/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePedidoItems, useEliminarPedidoItem } from "../../../hooks/usePedidoItems";
import { usePedidos } from "../../../hooks/usePedidos";
import { useProductos } from "../../../hooks/useProductos";

export default function PedidoItemsPage() {
  const { data: items, isLoading: iload, error: iErr } = usePedidoItems();
  const { data: pedidos = [], isLoading: pl } = usePedidos();
  const { data: productos = [], isLoading: prl } = useProductos();
  const eliminar = useEliminarPedidoItem();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter(pi => {
      const prod = productos.find(p => p.id_producto === pi.id_producto);
      const pd   = pedidos.find(p => p.id_pedido === pi.id_pedido);
      const text = [
        pi.id_detalle,
        prod?.nombre,
        pd ? `#${pd.id_pedido}` : ""
      ].join(" ");
      return text.toLowerCase().includes(q.toLowerCase());
    });
  }, [items, productos, pedidos, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (iload || pl || prl) return <p className="p-4 sm:p-8">Cargando…</p>;
  if (iErr)             return <p className="p-4 sm:p-8">Error: {iErr.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Líneas de Pedido</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar pedido o producto…"
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
          <Link
            href="/admin/pedido-items/new"
            className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
          >
            Nueva Línea
          </Link>
        </div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(pi => {
          const pd   = pedidos.find(p => p.id_pedido === pi.id_pedido)!;
          const prod = productos.find(p => p.id_producto === pi.id_producto)!;
          return (
            <div key={pi.id_detalle} className="bg-white p-4 rounded-lg shadow space-y-1">
              <p><strong>#Detalle:</strong> {pi.id_detalle}</p>
              <p><strong>Pedido:</strong> #{pd.id_pedido} ({new Date(pd.fecha_pedido).toLocaleDateString()})</p>
              <p><strong>Producto:</strong> {prod.nombre}</p>
              <p><strong>Cantidad:</strong> {pi.cantidad}</p>
              <p><strong>Precio Unit.:</strong> ${pi.precio_unit.toFixed(2)}</p>
              <div className="flex space-x-2 mt-2">
                <Link
                  href={`/admin/pedido-items/${pi.id_detalle}`}
                  className="flex-1 text-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setToDelete(pi.id_detalle)}
                  className="flex-1 text-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Borrar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="hidden lg:block">
        <table className="w-full bg-white rounded-lg shadow mb-4 whitespace-nowrap">
          <thead className="bg-[#F2C894] text-[#4C2A10]">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Pedido</th>
              <th className="p-4">Producto</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Precio Unit.</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(pi => {
              const pd   = pedidos.find(p => p.id_pedido === pi.id_pedido)!;
              const prod = productos.find(p => p.id_producto === pi.id_producto)!;
              return (
                <tr key={pi.id_detalle} className="border-b last:border-none hover:bg-gray-50">
                  <td className="p-4">{pi.id_detalle}</td>
                  <td className="p-4 whitespace-nowrap">
                    #{pd.id_pedido} ({new Date(pd.fecha_pedido).toLocaleDateString()})
                  </td>
                  <td className="p-4">{prod.nombre}</td>
                  <td className="p-4">{pi.cantidad}</td>
                  <td className="p-4">${pi.precio_unit.toFixed(2)}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <Link
                      href={`/admin/pedido-items/${pi.id_detalle}`}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => setToDelete(pi.id_detalle)}
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

      {/* Modal */}
      {toDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
            <p className="mb-6">¿Seguro que quieres eliminar la línea #{toDelete}?</p>
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
