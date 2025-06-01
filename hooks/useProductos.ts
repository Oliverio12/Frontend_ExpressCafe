// hooks/useProductos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  id_categoria: number;
  disponible: boolean;
  imagen_url: string | null;
}

// Listar productos
export function useProductos() {
  return useQuery<Producto[], Error>({
    queryKey: ["productos"],
    queryFn: async () => {
      const res = await api.get<Producto[]>("/productos");
      // Aseguramos que precio sea number
      return res.data.map(p => ({ ...p, precio: Number(p.precio) }));
    },
  });
}

// Crear producto
export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation<
    Producto,
    Error,
    Omit<Producto, "id_producto">
  >({
    mutationFn: nuevo =>
      api.post<Producto>("/productos", nuevo).then(r => ({
        ...r.data,
        precio: Number(r.data.precio),
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

// Actualizar producto
export function useActualizarProducto() {
  const queryClient = useQueryClient();
  return useMutation<
    Producto,
    Error,
    Producto
  >({
    mutationFn: prod =>
      api.put<Producto>(`/productos/${prod.id_producto}`, prod).then(r => ({
        ...r.data,
        precio: Number(r.data.precio),
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

// Borrar producto
export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    number
  >({
    mutationFn: id => api.delete(`/productos/${id}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}
