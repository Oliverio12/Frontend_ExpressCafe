// context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

export interface CartItem {
  id_producto: number;
  cantidad: number;
}

interface CartContextType {
  carrito: CartItem[];
  addToCart: (id_producto: number, cantidad?: number) => void;
  removeFromCart: (id_producto: number) => void;
  updateQuantity: (id_producto: number, cantidad: number) => void;
  getQuantity: (id_producto: number) => number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Leemos del localStorage al cargar
  const [carrito, setCarrito] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("mi_carrito");
    return saved ? JSON.parse(saved) : [];
  });

  // Cada vez que cambie carrito, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("mi_carrito", JSON.stringify(carrito));
  }, [carrito]);

  const addToCart = (id_producto: number, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_producto === id_producto);
      if (existe) {
        return prev.map((item) =>
          item.id_producto === id_producto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...prev, { id_producto, cantidad }];
      }
    });
  };

  const removeFromCart = (id_producto: number) => {
    setCarrito((prev) =>
      prev.filter((item) => item.id_producto !== id_producto)
    );
  };

  const updateQuantity = (id_producto: number, cantidad: number) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id_producto === id_producto ? { ...item, cantidad } : item
      )
    );
  };

  const getQuantity = (id_producto: number) => {
    const item = carrito.find((it) => it.id_producto === id_producto);
    return item ? item.cantidad : 0;
  };

  const value = useMemo(
    () => ({ carrito, addToCart, removeFromCart, updateQuantity, getQuantity }),
    [carrito]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
