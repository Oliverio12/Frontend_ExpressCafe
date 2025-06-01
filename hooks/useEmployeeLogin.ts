// hooks/useEmployeeLogin.ts
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export function useEmployeeLogin() {
  const { login, logout } = useAuth();

  return useMutation<LoginResponse, Error, Credentials>({
    mutationFn: async (creds: Credentials): Promise<LoginResponse> => {
      const response = await api.post<LoginResponse>("/usuarios/login", creds);
      return response.data;
    },
    onSuccess: ({ accessToken, refreshToken }) => {
      login(accessToken, refreshToken);
    },
    onError: () => {
      logout();
    },
  });
}
