"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Box,
  Truck,
  User,
  Users,
  Key,
  Tag,
  ShoppingCart,
  ClipboardList,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
  { name: "Inicio", href: "/admin/", icon: Home },
  { name: "Inventario", href: "/admin/inventario", icon: Box },
  { name: "Proveedores", href: "/admin/proveedores", icon: Truck },
  { name: "Clientes", href: "/admin/clientes", icon: User },
  { name: "Usuarios", href: "/admin/usuarios", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: Key },
  { name: "Categorías", href: "/admin/categorias", icon: Tag },
  { name: "Productos", href: "/admin/productos", icon: ShoppingCart },
  { name: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { name: "Pedidos Detalles", href: "/admin/pedido-items", icon: FileText },
  { name: "Compras", href: "/admin/compras", icon: ShoppingCart },
  { name: "Compras Detalles", href: "/admin/compra-items", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { accessToken, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [gestionOpen, setGestionOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return router.replace("/login");
    if (role === 1) return router.replace("/");
  }, [accessToken, role, router]);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push("/logout");
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const active = isActive(item.href);
    const baseClasses = "flex items-center px-3 py-2 rounded-lg transition-colors";
    const activeClasses = active
      ? "bg-[#E27A3F] text-white"
      : "text-[#4C2A10] hover:bg-[#FDE8D1] hover:text-[#E27A3F]";
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${baseClasses} ${activeClasses} ${isMobile ? "w-full" : ""}`}
        onClick={() => isMobile && setMobileNavOpen(false)}
      >
        <item.icon className="w-5 h-5 mr-2" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#FEF5E7] to-[#F2C894]">
      <aside className="hidden md:flex flex-col bg-white/80 backdrop-blur-md w-64 p-6 space-y-6 shadow-xl">
        <div className="relative w-24 h-24 p-2 bg-white/90 rounded-full overflow-hidden shadow-md">
          <Image src={logo} alt="Express Café Logo" fill className="object-contain" />
        </div>
        <nav className="flex flex-col flex-1">
          <button
            onClick={() => setGestionOpen(!gestionOpen)}
            className="flex items-center justify-between w-full text-[#4C2A10] text-lg font-semibold uppercase hover:text-[#E27A3F] transition-colors"
            aria-expanded={gestionOpen}
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Gestionar
            </div>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${gestionOpen ? "rotate-180" : ""}`}
            />
          </button>
          {gestionOpen && <div className="mt-4 flex flex-col space-y-2">{navItems.map(item => renderNavItem(item))}</div>}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md">
          <button onClick={() => setMobileNavOpen(true)}>
            <Menu className="w-6 h-6 text-[#4C2A10]" />
          </button>
          <div className="flex items-center">
            <div className="relative w-12 h-12 p-1 bg-white/90 rounded-full overflow-hidden shadow-md">
              <Image src={logo} alt="Express Café Logo" fill className="object-contain" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-[#4C2A10]">ExpressCafé</h1>
          </div>
          <button onClick={handleLogout} className="px-3 py-1 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-3/4 max-w-xs h-full bg-white p-6 space-y-6 shadow-xl">
              <button onClick={() => setMobileNavOpen(false)} className="text-[#4C2A10]">
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setGestionOpen(!gestionOpen)}
                  className="flex items-center justify-between w-full text-[#4C2A10] text-lg font-semibold uppercase hover:text-[#E27A3F] transition-colors"
                  aria-expanded={gestionOpen}
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Gestionar
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transform transition-transform ${gestionOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {gestionOpen && <div className="mt-2 flex flex-col space-y-2">{navItems.map(item => renderNavItem(item, true))}</div>}
              </div>
              <button
                onClick={handleLogout}
                className="mt-auto w-full px-4 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar sesióna
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
