"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import logo from "../../assets/logo.png";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Si no está autenticado, va a /login; si no es rol=1, va a /admin
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (role !== 1) {
      router.replace("/admin");
      return;
    }
  }, [accessToken, role, router]);

  const handleLogout = () => {
    logout();
    router.push("/logout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FEF5E7] to-[#F2C894]">
      {/* ---------------------- DESKTOP NAVBAR ---------------------- */}
      <header className="hidden md:flex w-full bg-white/80 backdrop-blur-md shadow-md px-6 py-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10 p-1 bg-white/90 rounded-full overflow-hidden">
            <Image
              src={logo}
              alt="Express Café Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-[#4C2A10]">Express Café</span>
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/" ? "text-[#E27A3F]" : ""
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/products" ? "text-[#E27A3F]" : ""
            }`}
          >
            Productos
          </Link>
          <Link
            href="/profile"
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Perfil
          </Link>

          <Link
            href={`/favorites/`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Favoritos
          </Link>

          {/* Agregar al Carrito */}
          <Link
            href={`/cart`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Carrito
          </Link>
          <Link
            href={`/orders`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Mis Ordenes
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg font-medium shadow-md transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      {/* ---------------------- MOBILE NAVBAR ---------------------- */}
      <header className="md:hidden flex items-center justify-between w-full bg-white/80 backdrop-blur-md shadow-md px-4 py-3">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="text-[#4C2A10] focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 p-1 bg-white/90 rounded-full overflow-hidden">
            <Image
              src={logo}
              alt="Express Café Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold text-[#4C2A10]">Express Café</span>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* ---------------------- MOBILE DRAWER ---------------------- */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-3/4 max-w-xs h-full bg-white p-6 shadow-xl flex flex-col">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="self-end text-[#4C2A10]"
            >
              <X className="w-6 h-6" />
            </button>

            <nav className="mt-6 flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className={`block text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
                  pathname === "/" ? "text-[#E27A3F]" : ""
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileNavOpen(false)}
                className={`block text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
                  pathname === "/products" ? "text-[#E27A3F]" : ""
                }`}
              >
                Productos
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileNavOpen(false)}
                className={`block text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
                  pathname === "/profile" ? "text-[#E27A3F]" : ""
                }`}
              >
                Perfil
              </Link>

              <Link
            href={`/favorites/`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Favoritos
          </Link>

          {/* Agregar al Carrito */}
          <Link
            href={`/cart`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Carrito
          </Link>
          <Link
            href={`/orders`}
            className={`text-[#4C2A10] hover:text-[#E27A3F] font-medium transition-colors ${
              pathname === "/profile" ? "text-[#E27A3F]" : ""
            }`}
          >
            Mis Ordenes
          </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto w-full px-4 py-2 bg-[#E27A3F] hover:bg-[#D4722E] text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Cerrar sesión
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* ---------------------- CHILDREN / CONTENT ---------------------- */}
      <main className="flex-1 overflow-auto">{children}</main>


       (
    <footer className="bg-[#4C2A10] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
          {/* Sección de enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#E27A3F]">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#E27A3F]">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-[#E27A3F]">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#E27A3F]">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#E27A3F]">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <p className="text-sm">
              Express Café<br />
              Universidad de Sonsonate, P7JJ+55C, Calle Ing. Jesús Adalberto Díaz Pineday, Avenida Central Final, Sonsonate<br />
              Sonsonate, El Salvador
            </p>
            <p className="text-sm">
              Email:{" "}
              <Link href="mailto:soporte@expresscafe.com" className="hover:text-[#E27A3F]">
                rodrigozavaleta12@gmail.com
              </Link>
              <br />
              Tel:{" "}
              <Link href="tel:+50312345678" className="hover:text-[#E27A3F]">
                +503 7063-6535
              </Link>
            </p>
          </div>
        </div>

        {/* Segunda fila con derechos */}
        <div className="mt-8 border-t border-white/30 pt-6 text-center text-sm text-white/80">
          © {new Date().getFullYear()} Express Café. Todos los derechos reservados.
        </div>
      </div>
    </footer>
    </div>
  );
}
