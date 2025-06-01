// app/(admin)/compra-items/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCompraItems, useEliminarCompraItem } from "../../../hooks/useCompraItems";
import { useCompras } from "../../../hooks/useCompras";
import { useInventario } from "../../../hooks/useInventario";

export default function CompraItemsPage() {
  const { data: items, isLoading: iload, error: iErr } = useCompraItems();
  const { data: compras = [], isLoading: cl } = useCompras();
  const { data: inventario = [], isLoading: il } = useInventario();
  const eliminar = useEliminarCompraItem();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toDelete, setToDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter(ci => {
      const comp = compras.find(c => c.id_compra === ci.id_compra);
      const ins  = inventario.find(i => i.id_insumo === ci.id_insumo);
      const text = [
        ci.id_detalle,
        comp ? `#${comp.id_compra}` : "",
        ins?.nombre
      ].join(" ");
      return text.toLowerCase().includes(q.toLowerCase());
    });
  }, [items, compras, inventario, q]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  if (iload || cl || il) return <p className="p-4 sm:p-8">Cargando…</p>;
  if (iErr)        return <p className="p-4 sm:p-8">Error: {iErr.message}</p>;

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C2A10]">Items de Compras</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            placeholder="Filtrar por compra o insumo…"
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
            href="/admin/compra-items/new"
            className="w-full md:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
          >
            Nuevo Item
          </Link>
        </div>
      </header>

      {/* Cards móvil/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {paginated.map(ci => {
          const comp = compras.find(c => c.id_compra === ci.id_compra)!;
          const ins  = inventario.find(i => i.id_insumo === ci.id_insumo)!;
          return (
            <div
              key={ci.id_detalle}
              className="bg-white p-4 rounded-lg shadow space-y-1"
            >
              <p><strong>#Detalle:</strong> {ci.id_detalle}</p>
              <p><strong>Compra:</strong> #{comp.id_compra} ({new Date(comp.fecha_compra).toLocaleDateString()})</p>
              <p><strong>Insumo:</strong> {ins.nombre}</p>
              <p><strong>Cantidad:</strong> {ci.cantidad}</p>
              <p><strong>Precio Unit.:</strong> ${ci.precio_unit.toFixed(2)}</p>
              <div className="flex space-x-2 mt-2">
                <Link
                  href={`/admin/compra-items/${ci.id_detalle}`}
                  className="flex-1 text-center px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setToDelete(ci.id_detalle)}
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
              <th className="p-4">#Detalle</th>
              <th className="p-4">Compra</th>
              <th className="p-4">Insumo</th>
              <th className="p-4">Cantidad</th>
              <th className="p-4">Precio Unit.</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(ci => {
              const comp = compras.find(c => c.id_compra === ci.id_compra)!;
              const ins  = inventario.find(i => i.id_insumo === ci.id_insumo)!;
              return (
                <tr key={ci.id_detalle} className="border-b last:border-none hover:bg-gray-50">
                  <td className="p-4">{ci.id_detalle}</td>
                  <td className="p-4 whitespace-nowrap">
                    #{comp.id_compra} ({new Date(comp.fecha_compra).toLocaleDateString()})
                  </td>
                  <td className="p-4">{ins.nombre}</td>
                  <td className="p-4">{ci.cantidad}</td>
                  <td className="p-4">${ci.precio_unit.toFixed(2)}</td>
                  <td className="p-4 flex justify-center space-x-2">
                    <Link
                      href={`/admin/compra-items/${ci.id_detalle}`}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => setToDelete(ci.id_detalle)}
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
            <p className="mb-6">
              ¿Eliminar item <strong>#{toDelete}</strong>?
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
    </div>)
}
