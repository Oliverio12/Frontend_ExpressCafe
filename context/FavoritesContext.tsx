// context/FavoritesContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from "react";

interface FavoritesContextType {
  favoritos: number[];
  addFavorite: (id_producto: number) => void;
  removeFavorite: (id_producto: number) => void;
  isFavorite: (id_producto: number) => boolean;
}
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  // Inicializamos leyendo localStorage
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("mis_favoritos");
    return saved ? JSON.parse(saved) : [];
  });

  // Cada vez que cambie favoritos, actualizamos localStorage
  useEffect(() => {
    localStorage.setItem("mis_favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const addFavorite = (id_producto: number) => {
    setFavoritos((prev) => {
      if (prev.includes(id_producto)) return prev;
      return [...prev, id_producto];
    });
  };

  const removeFavorite = (id_producto: number) => {
    setFavoritos((prev) => prev.filter((id) => id !== id_producto));
  };

  const isFavorite = (id_producto: number) => {
    return favoritos.includes(id_producto);
  };

  const value = useMemo(
    () => ({ favoritos, addFavorite, removeFavorite, isFavorite }),
    [favoritos]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites debe usarse dentro de un FavoritesProvider"
    );
  }
  return context;
};
