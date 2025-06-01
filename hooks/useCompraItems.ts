// hooks/useCompraItems.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface CompraItem {
  id_detalle: number;
  id_compra: number;
  id_insumo: number;
  cantidad: number;
  precio_unit: number;
}

export function useCompraItems() {
  return useQuery<CompraItem[], Error>({
    queryKey: ["compraItem"],
    queryFn: async () => {
      const res = await api.get<CompraItem[]>("/compraItem");
      return res.data.map(ci => ({
        ...ci,
        cantidad: Number(ci.cantidad),
        precio_unit: Number(ci.precio_unit),
      }));
    },
  });
}

export function useCompraItem(id: number) {
  return useQuery<CompraItem, Error>({
    queryKey: ["compraItem", id],
    queryFn: async () => {
      const res = await api.get<CompraItem>(`/compraItem/${id}`);
      const c = res.data;
      return {
        ...c,
        cantidad: Number(c.cantidad),
        precio_unit: Number(c.precio_unit),
      };
    },
  });
}

export function useCrearCompraItem() {
  const qc = useQueryClient();
  return useMutation<CompraItem, Error, Omit<CompraItem, "id_detalle">>({
    mutationFn: datos =>
      api.post<CompraItem>("/compraItem", datos).then(r => {
        const d = r.data;
        return { ...d, cantidad: Number(d.cantidad), precio_unit: Number(d.precio_unit) };
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compraItem"] }),
  });
}

export function useActualizarCompraItem() {
  const qc = useQueryClient();
  return useMutation<CompraItem, Error, CompraItem>({
    mutationFn: item =>
      api.put<CompraItem>(`/compraItem/${item.id_detalle}`, item).then(r => {
        const d = r.data;
        return { ...d, cantidad: Number(d.cantidad), precio_unit: Number(d.precio_unit) };
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compraItem"] }),
  });
}

export function useEliminarCompraItem() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: id => api.delete(`/compraItem/${id}`).then(() => {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compra-items"] }),
  });
}
