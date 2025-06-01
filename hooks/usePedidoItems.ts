// hooks/usePedidoItems.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface PedidoItem {
  id_detalle: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unit: number;
}

export function usePedidoItems() {
  return useQuery<PedidoItem[], Error>({
    queryKey: ["pedidoItem"],
    queryFn: async () => {
      const res = await api.get<PedidoItem[]>("/pedidoItem");
      return res.data.map(pi => ({
        ...pi,
        cantidad: Number(pi.cantidad),
        precio_unit: Number(pi.precio_unit),
      }));
    },
  });
}

export function usePedidoItem(id: number) {
  return useQuery<PedidoItem, Error>({
    queryKey: ["pedidoItem", id],
    queryFn: async () => {
      const res = await api.get<PedidoItem>(`/pedidoItem/${id}`);
      const p = res.data;
      return {
        ...p,
        cantidad: Number(p.cantidad),
        precio_unit: Number(p.precio_unit),
      };
    },
  });
}

export function useCrearPedidoItem() {
  const queryClient = useQueryClient();
  return useMutation<PedidoItem, Error, Omit<PedidoItem, "id_detalle">>({
    mutationFn: (datos) =>
      api
        .post<PedidoItem>("/pedidoItem", datos)
        .then(r => {
          const d = r.data;
          return { ...d, cantidad: Number(d.cantidad), precio_unit: Number(d.precio_unit) };
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidoItem"] });
    },
  });
}

export function useActualizarPedidoItem() {
  const queryClient = useQueryClient();
  return useMutation<PedidoItem, Error, PedidoItem>({
    mutationFn: (item) =>
      api
        .put<PedidoItem>(`/pedidoItem/${item.id_detalle}`, item)
        .then(r => {
          const d = r.data;
          return { ...d, cantidad: Number(d.cantidad), precio_unit: Number(d.precio_unit) };
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidoItem"] });
    },
  });
}

export function useEliminarPedidoItem() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/pedidoItem/${id}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidoItem"] });
    },
  });
}
