// services/auth.ts
import api from './api';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

/**
 * Configura el interceptor de respuesta para refrescar automáticamente el token
 * @param logoutCallback función que cierra sesión en error irreparable
 */
export function setupAuthInterceptor(logoutCallback: () => void) {
  api.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        return new Promise((resolve, reject) => {
          api.post('/usuarios/refresh-token', { refreshToken })
            .then(({ data }) => {
              const newToken = data.accessToken;
              localStorage.setItem('accessToken', newToken);
              api.defaults.headers.Authorization = `Bearer ${newToken}`;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              processQueue(null, newToken);
              resolve(api(originalRequest));
            })
            .catch(err => {
              processQueue(err, null);
              logoutCallback();
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
      return Promise.reject(error);
    }
  );
}

