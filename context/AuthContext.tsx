// context/AuthContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  role: number | null;
  nombre: string | null;
  apellidos: string | null;

  // NUEVO: email
  email: string | null;

  login: (
    accessToken: string,
    refreshToken?: string,
    nombre?: string,
    apellidos?: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellidos, setApellidos] = useState<string | null>(null);

  // NUEVO: guardaremos el email en estado
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccess = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");
      const storedNombre = localStorage.getItem("nombre");
      const storedApellidos = localStorage.getItem("apellidos");
      // NUEVO:
      const storedEmail = localStorage.getItem("email");

      if (storedAccess) {
        setAccessToken(storedAccess);
        try {
          const payload = JSON.parse(atob(storedAccess.split(".")[1]));
          setRole(payload.role || null);

          // Si el payload incluye un email, lo guardamos
          if (payload.email) {
            setEmail(payload.email);
            localStorage.setItem("email", payload.email);
          }
        } catch {
          setRole(null);
        }
      }

      if (storedRefresh) setRefreshToken(storedRefresh);
      if (storedNombre) setNombre(storedNombre);
      if (storedApellidos) setApellidos(storedApellidos);
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  const login = (
    newAccess: string,
    newRefresh?: string,
    newNombre?: string,
    newApellidos?: string
  ) => {
    // Guardamos el token
    localStorage.setItem("accessToken", newAccess);
    setAccessToken(newAccess);

    // Decodificamos el JWT para extraer role + email
    try {
      const payloadBase64 = newAccess.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload: Record<string, any> = JSON.parse(payloadJson);

      if (payload.role) {
        setRole(payload.role);
      }
      if (payload.email) {
        setEmail(payload.email);
        localStorage.setItem("email", payload.email);
      }

      // Nombre/apellidos (opcional)
      if (newNombre) {
        setNombre(newNombre);
        localStorage.setItem("nombre", newNombre);
      } else if (payload.nombre) {
        setNombre(payload.nombre);
        localStorage.setItem("nombre", payload.nombre);
      }

      if (newApellidos) {
        setApellidos(newApellidos);
        localStorage.setItem("apellidos", newApellidos);
      } else if (payload.apellidos) {
        setApellidos(payload.apellidos);
        localStorage.setItem("apellidos", payload.apellidos);
      }
    } catch {
      // Si no es un JWT estándar, por lo menos guardamos nombre/apellidos manuales
      if (newNombre) {
        setNombre(newNombre);
        localStorage.setItem("nombre", newNombre);
      }
      if (newApellidos) {
        setApellidos(newApellidos);
        localStorage.setItem("apellidos", newApellidos);
      }
      setRole(null);
      setEmail(null);
    }

    // Refresh token
    if (newRefresh) {
      localStorage.setItem("refreshToken", newRefresh);
      setRefreshToken(newRefresh);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("nombre");
    localStorage.removeItem("apellidos");
    localStorage.removeItem("email");
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setNombre(null);
    setApellidos(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        role,
        nombre,
        apellidos,
        email,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used dentro de un AuthProvider");
  }
  return context;
};
