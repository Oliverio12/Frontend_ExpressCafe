// app/(admin)/page.tsx
"use client";
import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsuarios } from "../../hooks/useUsuarios";
import { useClientes } from "../../hooks/useClientes";
import { useCategorias } from "../../hooks/useCategorias";
import { useProductos } from "../../hooks/useProductos";
import { usePedidos } from "../../hooks/usePedidos";
import { useInventario } from "../../hooks/useInventario";
import { useProveedores } from "../../hooks/useProveedores";

import {
  BellIcon,
  CubeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { nombre, apellidos, role } = useAuth();

  const { data: usuarios, isLoading: uLoad } = useUsuarios();
  const { data: clientes, isLoading: cLoad } = useClientes();
  const { data: categorias, isLoading: catLoad } = useCategorias();
  const { data: productos, isLoading: pLoad } = useProductos();
  const { data: pedidos, isLoading: pedLoad } = usePedidos();
  const { data: inventario, isLoading: iLoad } = useInventario();
  const { data: proveedores, isLoading: provLoad } = useProveedores();

  const lowStock = useMemo(
    () => inventario?.filter((i) => Number(i.cantidad_disp) < 10) || [],
    [inventario]
  );

  const widgets = [
    { title: "Usuarios", count: usuarios?.length, icon: UsersIcon, loading: uLoad, color: "text-green-600", link: "/admin/usuarios" },
    { title: "Clientes", count: clientes?.length, icon: UserGroupIcon, loading: cLoad, color: "text-blue-600", link: "/admin/clientes" },
    { title: "Categorías", count: categorias?.length, icon: ClipboardDocumentListIcon, loading: catLoad, color: "text-yellow-500", link: "/admin/categorias" },
    { title: "Productos", count: productos?.length, icon: CubeIcon, loading: pLoad, color: "text-red-500", link: "/admin/productos" },
    { title: "Pedidos", count: pedidos?.length, icon: ShoppingCartIcon, loading: pedLoad, color: "text-purple-600", link: "/admin/pedidos" },
    { title: "Proveedores", count: proveedores?.length, icon: UsersIcon, loading: provLoad, color: "text-teal-600", link: "/admin/proveedores" },
    { title: "Insumos bajos", count: lowStock.length, icon: BellIcon, loading: iLoad, color: "text-orange-500", link: "/admin/inventario" },
  ];

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen space-y-12">
      {/* Encabezado */}
      <header className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4C2A10]">¡Bienvenido!</h1>
          <p className="text-gray-600 mt-1">
            Rol: {role === 3 ? "Admin" : role === 2 ? "Empleado" : "Cliente"}
          </p>
          <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/admin/pedidos/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-center"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Nuevo Pedido
          </Link>
          <Link
            href="/admin/productos/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-center"
          >
            <CubeIcon className="w-5 h-5" />
            Agregar Producto
          </Link>
        </div>
      </header>

      {/* Tarjetas de métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {widgets.map(({ title, count, icon: Icon, loading, color, link }) => (
          <Link
            key={title}
            href={link}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Icon className={`w-10 h-10 ${color}`} />
            <div>
              <p className="text-gray-500">{title}</p>
              {loading ? (
                <p className="text-gray-300">Cargando…</p>
              ) : (
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
              )}
            </div>
          </Link>
        ))}
      </section>

      {/* Secciones destacadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Últimos Pedidos */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#4C2A10] mb-4">Últimos Pedidos</h2>
          {pedLoad ? (
            <p className="text-gray-400">Cargando…</p>
          ) : pedidos?.length ? (
            <ul className="divide-y">
              {pedidos.slice(-5).reverse().map((p) => (
                <li key={p.id_pedido} className="py-2 flex justify-between whitespace-nowrap">
                  <span className="font-medium">#{p.id_pedido}</span>
                  <span className="text-sm text-gray-600">{new Date(p.fecha_pedido).toLocaleDateString()}</span>
                  <span className="capitalize">{p.estado_pedido}</span>
                  <span className="font-semibold">${p.total}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay pedidos recientes.</p>
          )}
        </section>

        {/* Alertas de inventario */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-[#4C2A10] mb-4">Insumos en stock bajo</h2>
          {iLoad ? (
            <p className="text-gray-400">Cargando…</p>
          ) : lowStock.length ? (
            <ul className="divide-y">
              {lowStock.slice(0, 5).map((i) => (
                <li key={i.id_insumo} className="py-2 flex justify-between whitespace-nowrap">
                  <span>{i.nombre}</span>
                  <span className="text-red-600 font-semibold">
                    {i.cantidad_disp} {i.unidad_medida}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">Todos los insumos están OK.</p>
          )}
        </section>
      </div>
    </main>
);
}
