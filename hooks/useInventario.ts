// hooks/useInventario.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Insumo {
  id_insumo: number;
  nombre: string;
  descripcion: string | null;
  cantidad_disp: number;
  unidad_medida: string;
}

// Fetch all insumos
export function useInventario() {
  return useQuery<Insumo[], Error>({
    queryKey: ["inventario"],
    queryFn: async () => {
      const res = await api.get<Insumo[]>("/inventario");
      return res.data;
    },
  });
}

// Create new insumo
export function useCrearInsumo() {
  const queryClient = useQueryClient();
  return useMutation<Insumo, Error, Omit<Insumo, "id_insumo">>({
    mutationFn: (insumo) =>
      api.post<Insumo>("/inventario", insumo).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}

// Update insumo
export function useActualizarInsumo() {
  const queryClient = useQueryClient();
  return useMutation<Insumo, Error, Insumo>({
    mutationFn: (insumo) =>
      api
        .put<Insumo>(`/inventario/${insumo.id_insumo}`, insumo)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}

// Delete insumo
export function useEliminarInsumo() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id_insumo) =>
      api.delete(`/inventario/${id_insumo}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}
