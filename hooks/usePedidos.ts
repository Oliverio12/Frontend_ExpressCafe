import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface PedidoItemInput {
  id_producto: number;
  cantidad: number;
}

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  fecha_pedido: string;
  estado_pedido: "pendiente" | "procesando" | "listo" | "cancelado";
  total: number;
}

// Listar todos los pedidos
export function usePedidos() {
  return useQuery<Pedido[], Error>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const res = await api.get<Pedido[]>("/pedidos");
      // Asegurar tipos numéricos
      return res.data.map((p) => ({ ...p, total: Number(p.total) }));
    },
  });
}

// Ver un pedido por id
export function usePedido(id: number) {
  return useQuery<Pedido, Error>({
    queryKey: ["pedidos", id],
    queryFn: async () => {
      const res = await api.get<Pedido>(`/pedidos/${id}`);
      return { ...res.data, total: Number(res.data.total) };
    },
  });
}

// Crear un pedido: enviamos id_cliente + array de items
export function useCrearPedido() {
  const qc = useQueryClient();
  return useMutation<
    { pedido: Pedido; total: number },
    Error,
    { id_cliente: number; items: PedidoItemInput[] }
  >({
    mutationFn: (body) =>
      api.post<{ pedido: Pedido; total: number }>("/pedidos", body).then((res) => ({
        pedido: { ...res.data.pedido, total: Number(res.data.pedido.total) },
        total: Number(res.data.total),
      })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

// Actualizar un pedido (p.ej. estado o total)
export function useActualizarPedido() {
  const qc = useQueryClient();
  return useMutation<Pedido, Error, Partial<Pedido> & { id_pedido: number }>({
    mutationFn: ({ id_pedido, ...payload }) =>
      api.put<Pedido>(`/pedidos/${id_pedido}`, payload).then((res) => ({
        ...res.data,
        total: Number(res.data.total),
      })),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["pedidos"] });
      qc.invalidateQueries({ queryKey: ["pedidos", vars.id_pedido] });
    },
  });
}

// Eliminar pedido
export function useEliminarPedido() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/pedidos/${id}`).then(() => {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pedidos"] }),
  });
}
