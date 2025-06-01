// app/layout.tsx
"use client";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ExpressCafe</title>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <FavoritesProvider>
              <CartProvider>{children}</CartProvider>
            </FavoritesProvider>
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
