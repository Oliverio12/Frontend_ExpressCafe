// hooks/useRoles.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Rol {
  id_rol: number;
  nombre_rol: "cliente" | "empleado" | "admin";
}

// Listar roles
export function useRoles() {
  return useQuery<Rol[], Error>({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get<Rol[]>("/roles");
      return res.data;
    },
  });
}
