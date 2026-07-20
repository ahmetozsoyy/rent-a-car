import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  email: string | null;
  locationId: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const getInitialState = () => {
  const token = localStorage.getItem('token');
  if (!token) return { token: null, isAuthenticated: false, role: null, email: null, locationId: null };
  const payload = parseJwt(token);
  return {
    token,
    isAuthenticated: true,
    role: payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload?.role || null,
    email: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload?.email || null,
    locationId: payload?.LocationId || null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  login: (token: string) => {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    set({ 
      token, 
      isAuthenticated: true,
      role: payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload?.role || null,
      email: payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload?.email || null,
      locationId: payload?.LocationId || null,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, role: null, email: null });
  },
}));
