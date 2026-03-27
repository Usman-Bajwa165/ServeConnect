import { useState, useEffect } from 'react';
import { AuthUser, getUser, getToken, clearAuth } from '@/lib/auth';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();
    
    if (token && currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      // Ignored
    } finally {
      clearAuth();
      setUser(null);
      router.push('/login');
    }
  };

  return { user, loading, logout };
}
