import axios from 'axios';
import { getToken, getCookie, updateToken, removeUserSession } from '../utils/Common';

const API = axios.create({
  baseURL: process.env.REACT_APP_DB_API_URL,
  // Required so the browser sends the httpOnly refresh_token cookie and
  // returns the readable csrf_refresh_token cookie.
  withCredentials: true,
});

// Attaches the bearer token fresh on every request (previously this was set
// once at module load, so a refreshed token never reached in-flight/new
// requests without a full page reload).
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  // refreshToken/logout are guarded by VerifyCsrfCookie on the backend
  // (double-submit pattern): echo the readable csrf_refresh_token cookie
  // value back as a header so the backend can verify it.
  if (config.url && (config.url.includes('refreshToken') || config.url.includes('logout'))) {
    const csrfToken = getCookie('csrf_refresh_token');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
  }

  return config;
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  refreshQueue = [];
};

const clearSessionAndRedirect = () => {
  removeUserSession();
  window.location.href = '/login';
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const original = error.config;
    const code = error.response && error.response.data && error.response.data.code;

    if (!error.response || error.response.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // A 401 on the login request itself is a credential problem, not an expired token.
    if (original.url && original.url.includes('login')) {
      return Promise.reject(error);
    }

    // TOKEN_INVALID/TOKEN_ABSENT (or no code) mean the session is unrecoverable.
    if (code !== 'TOKEN_EXPIRED') {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then(() => API(original));
    }

    original._retry = true;
    isRefreshing = true;

    const csrfToken = getCookie('csrf_refresh_token');

    // Bare axios call (not the API instance) so this doesn't recurse through
    // this same response interceptor.
    return axios
      .post(
        `${API.defaults.baseURL}refreshToken`,
        {},
        {
          withCredentials: true,
          headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
        }
      )
      .then((res) => {
        const newToken = res.data.access_token;
        updateToken(newToken);
        processQueue(null, newToken);
        return API(original);
      })
      .catch((refreshError) => {
        processQueue(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }
);

// Calls the backend logout endpoint (revokes the refresh token server-side),
// then always clears the local session and redirects. Use this everywhere
// instead of clearing localStorage directly — a client-only "logout" leaves
// the refresh token valid in Redis until its TTL expires.
export const logoutUser = () => {
  return API.post('logout')
    .catch(() => {})
    .finally(() => {
      removeUserSession();
      window.location.href = '/login';
    });
};

export default API;
