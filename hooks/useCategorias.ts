// hooks/useCategorias.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

// Fetch all categorías
export function useCategorias() {
  return useQuery<Categoria[], Error>({
    queryKey: ["categorias"],
    queryFn: async () => {
      const res = await api.get<Categoria[]>("/categorias");
      return res.data;
    },
  });
}

// Create new categoría
export function useCrearCategoria() {
  const queryClient = useQueryClient();
  return useMutation<Categoria, Error, Omit<Categoria, "id_categoria">>({
    mutationFn: (categoria) =>
      api.post<Categoria>("/categorias", categoria).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}

// Update categoría
export function useActualizarCategoria() {
  const queryClient = useQueryClient();
  return useMutation<Categoria, Error, Categoria>({
    mutationFn: (categoria) =>
      api
        .put<Categoria>(`/categorias/${categoria.id_categoria}`, categoria)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}

// Delete categoría
export function useEliminarCategoria() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id_categoria) =>
      api.delete(`/categorias/${id_categoria}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}
