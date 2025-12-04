import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { dataCache } from '@/lib/cache';
import type { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  establishment: string;
  type: string;
  city: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: UserProfile & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Crear perfil desde metadata del usuario (fallback rápido)
const createProfileFromMetadata = (authUser: User): UserProfile => ({
  id: authUser.id,
  name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
  email: authUser.email || '',
  establishment: authUser.user_metadata?.establishment || 'Mi Establecimiento',
  type: authUser.user_metadata?.type || 'restaurant',
  city: authUser.user_metadata?.city || 'Pasto',
  role: 'user'
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  // Fetch profile con timeout de 5 segundos
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, establishment, type, city, role')
        .eq('id', userId)
        .single()
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.warn('Error fetching profile:', error.message);
        return null;
      }

      return {
        ...data,
        role: data.role || 'user'
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn('Profile fetch timeout');
      } else {
        console.error('Error fetching profile:', err);
      }
      return null;
    }
  };

  // Cargar perfil en background (no bloquea UI)
  const loadProfileInBackground = async (authUser: User) => {
    const profile = await fetchUserProfile(authUser.id);
    if (profile) {
      setUser(profile);
    }
  };

  useEffect(() => {
    // Evitar doble inicialización
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setSession(currentSession);
          // Usar metadata inmediatamente para no bloquear
          setUser(createProfileFromMetadata(currentSession.user));
          setLoading(false);
          // Cargar perfil completo en background
          loadProfileInBackground(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    // Timeout de seguridad de 3 segundos (más corto)
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth init timeout');
        setLoading(false);
      }
    }, 3000);

    initAuth().finally(() => clearTimeout(timeoutId));

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth event:', event);

        if (event === 'SIGNED_OUT' || !newSession) {
          setUser(null);
          setSession(null);
          setLoading(false);
        } else if (newSession?.user) {
          setSession(newSession);
          // Usar metadata inmediatamente
          setUser(createProfileFromMetadata(newSession.user));
          setLoading(false);
          // Cargar perfil completo en background
          loadProfileInBackground(newSession.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const register = async (userData: UserProfile & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { password, ...profileData } = userData;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
        options: {
          data: {
            name: profileData.name,
            establishment: profileData.establishment,
            type: profileData.type,
            city: profileData.city,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'No se pudo crear el usuario' };
      }

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: profileData.name,
          email: profileData.email,
          establishment: profileData.establishment,
          type: profileData.type,
          city: profileData.city,
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        await supabase.auth.signOut();
        return { success: false, error: 'Error al crear perfil: ' + profileError.message };
      }

      if (authData.session) {
        setSession(authData.session);
        setUser({
          id: authData.user.id,
          ...profileData,
          role: 'user'
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Error inesperado durante el registro' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'No se pudo iniciar sesión' };
      }

      // Establecer sesión y usuario básico inmediatamente
      setSession(data.session);
      setUser(createProfileFromMetadata(data.user));

      // Cargar perfil completo en background
      loadProfileInBackground(data.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error inesperado durante el inicio de sesión' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    dataCache.clearAll();
  };

  const isAuthenticated = !!session;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
