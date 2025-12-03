import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface UserProfile {
  name: string;
  email: string;
  establishment: string;
  type: string;
  city: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: UserProfile & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, establishment, type, city')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        // Timeout de seguridad
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );

        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        setSession(session);

        if (session?.user) {
          let profile = await fetchUserProfile(session.user.id);
          
          // Si no existe el perfil, usar datos del metadata
          if (!profile) {
            profile = {
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
              email: session.user.email || '',
              establishment: session.user.user_metadata?.establishment || 'Mi Establecimiento',
              type: session.user.user_metadata?.type || 'restaurant',
              city: session.user.user_metadata?.city || 'Pasto'
            };
          }
          
          setUser(profile);
        }
      } catch (err) {
        console.error('Error getting session:', err);
        // Si hay error, asegurar que loading se ponga en false
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth event:', event);
        setSession(newSession);

        if (event === 'SIGNED_OUT' || !newSession) {
          setUser(null);
          setSession(null);
        } else if (newSession?.user) {
          const profile = await fetchUserProfile(newSession.user.id);
          setUser(profile);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const register = async (userData: UserProfile & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { password, ...profileData } = userData;

      console.log('Starting registration for:', userData.email);

      // 1. Crear usuario en Supabase Auth
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

      console.log('SignUp response:', { authData, authError });

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'No se pudo crear el usuario' };
      }

      // 2. Crear perfil en la tabla profiles
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

      console.log('Profile insert result:', { profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        // Si falla la creación del perfil, eliminar el usuario de auth
        await supabase.auth.signOut();
        return { success: false, error: 'Error al crear perfil: ' + profileError.message };
      }

      // 3. Actualizar estado local solo si hay sesión
      if (authData.session) {
        setSession(authData.session);
        setUser(profileData);
        return { success: true };
      }

      // Si no hay sesión inmediata, el usuario debe confirmar email
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Error inesperado durante el registro' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { data, error });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user || !data.session) {
        return { success: false, error: 'No se pudo iniciar sesión' };
      }

      // Intentar obtener perfil del usuario
      let profile = await fetchUserProfile(data.user.id);
      
      // Si no existe el perfil, usar datos del metadata o crear uno temporal
      if (!profile) {
        console.warn('Profile not found, using metadata or defaults');
        profile = {
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
          email: data.user.email || email,
          establishment: data.user.user_metadata?.establishment || 'Mi Establecimiento',
          type: data.user.user_metadata?.type || 'restaurant',
          city: data.user.user_metadata?.city || 'Pasto'
        };
      }

      setUser(profile);
      setSession(data.session);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error inesperado durante el inicio de sesión' };
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    console.log('Logged out successfully');
  };

  const isAuthenticated = !!session;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
