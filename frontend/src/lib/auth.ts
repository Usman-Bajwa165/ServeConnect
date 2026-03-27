import Cookies from 'js-cookie';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SERVICE_PROVIDER' | 'SERVICE_AVAILER';
  city?: string;
  isBanned: boolean;
}

export function setAuth(token: string, user: AuthUser) {
  Cookies.set('token', token, { expires: 7, sameSite: 'lax' });
  Cookies.set('user', JSON.stringify(user), { expires: 7, sameSite: 'lax' });
}

export function getToken(): string | undefined {
  return Cookies.get('token');
}

export function getUser(): AuthUser | null {
  try {
    const raw = Cookies.get('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  Cookies.remove('token');
  Cookies.remove('user');
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'SERVICE_PROVIDER':
      return '/provider/dashboard';
    case 'SERVICE_AVAILER':
      return '/availer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}
