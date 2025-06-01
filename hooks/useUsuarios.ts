// hooks/useUsuarios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  password_hash?: string;     // solo viene al crear
  fecha_registro: string;
  id_rol: number;
}

// Listar todos
export function useUsuarios() {
  return useQuery<Usuario[], Error>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const res = await api.get<Usuario[]>("/usuarios");
      return res.data;
    },
  });
}

// Obtener uno
export function useUsuario(id: number) {
  return useQuery<Usuario, Error>({
    queryKey: ["usuarios", id],
    queryFn: async () => {
      const res = await api.get<Usuario>(`/usuarios/${id}`);
      return res.data;
    },
  });
}

// Crear (no enviamos ni id_usuario ni fecha_registro)
export type NewUsuario = {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;   // en backend lo hashearán
  id_rol: number;
};
export function useCrearUsuario() {
  const qc = useQueryClient();
  return useMutation<Usuario, Error, NewUsuario>({
    mutationFn: (u) => api.post<Usuario>("/usuarios/register", u).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// Actualizar (omitimos fecha_registro y password)
export type UpdateUsuario = Omit<Usuario, "fecha_registro" | "password_hash">;
export function useActualizarUsuario() {
  const qc = useQueryClient();
  return useMutation<Usuario, Error, UpdateUsuario>({
    mutationFn: (u) =>
      api.put<Usuario>(`/usuarios/${u.id_usuario}`, u).then(r => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["usuarios"] });
      qc.invalidateQueries({ queryKey: ["usuarios", vars.id_usuario] });
    },
  });
}

// Eliminar
export function useEliminarUsuario() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/usuarios/${id}`).then(() => {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
