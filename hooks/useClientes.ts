// hooks/useClientes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Cliente {
  id_cliente: number;
  google_sub: string;
  nombre: string;
  apellidos: string;
  email: string;
  fecha_registro: string;
  id_rol: number;
}

// Para crear: omitimos id_cliente y fecha_registro
export type CreateCliente = Omit<Cliente, "id_cliente" | "fecha_registro">;
// Para actualizar: idem
export type UpdateCliente = CreateCliente & { id_cliente: number };

export function useClientes() {
  return useQuery<Cliente[], Error>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const res = await api.get<Cliente[]>("/clientes");
      return res.data;
    },
  });
}



export function useEliminarCliente() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/clientes/${id}`).then(() => {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientes"] }),
  });
}
