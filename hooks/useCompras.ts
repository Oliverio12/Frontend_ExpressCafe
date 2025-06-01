// hooks/useCompras.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Compra {
  id_compra: number;
  id_proveedor: number;
  fecha_compra: string;
  total: number;
}

export function useCompras() {
  return useQuery<Compra[], Error>({
    queryKey: ["compras"],
    queryFn: async () => {
      const res = await api.get<Compra[]>("/compras");
      return res.data.map(c => ({ ...c, total: Number(c.total) }));
    },
  });
}

export function useCompra(id: number) {
  return useQuery<Compra, Error>({
    queryKey: ["compras", id],
    queryFn: async () => {
      const res = await api.get<Compra>(`/compras/${id}`);
      const c = res.data;
      return { ...c, total: Number(c.total) };
    },
  });
}
export function useCrearCompra() {
  const qc = useQueryClient();
  return useMutation<Compra, Error, Omit<Compra, "id_compra" | "fecha_compra">>({
    mutationFn: datos =>
      api.post<Compra>("/compras", datos).then(r => ({
        ...r.data,
        total: Number(r.data.total),
      })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compras"] }),
  });
}
export function useActualizarCompra() {
  const qc = useQueryClient();
  return useMutation<Compra, Error, Compra>({
    mutationFn: compra =>
      api.put<Compra>(`/compras/${compra.id_compra}`, compra).then(r => ({
        ...r.data,
        total: Number(r.data.total),
      })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compras"] }),
  });
}
export function useEliminarCompra() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: id => api.delete(`/compras/${id}`).then(() => {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compras"] }),
  });
}
