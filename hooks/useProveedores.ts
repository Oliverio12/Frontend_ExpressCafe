// hooks/useProveedores.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  contacto: string | null;
}

// Fetch all proveedores
export function useProveedores() {
  return useQuery<Proveedor[], Error>({
    queryKey: ["proveedores"],
    queryFn: async () => {
      const res = await api.get<Proveedor[]>("/proveedores");
      return res.data;
    },
  });
}

// Create new proveedor
export function useCrearProveedor() {
  const queryClient = useQueryClient();
  return useMutation<Proveedor, Error, Omit<Proveedor, "id_proveedor">>({
    mutationFn: (prov) =>
      api.post<Proveedor>("/proveedores", prov).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
}

// Update proveedor
export function useActualizarProveedor() {
  const queryClient = useQueryClient();
  return useMutation<Proveedor, Error, Proveedor>({
    mutationFn: (prov) =>
      api
        .put<Proveedor>(`/proveedores/${prov.id_proveedor}`, prov)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
}

// Delete proveedor
export function useEliminarProveedor() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id_proveedor) =>
      api.delete(`/proveedores/${id_proveedor}`).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
}
