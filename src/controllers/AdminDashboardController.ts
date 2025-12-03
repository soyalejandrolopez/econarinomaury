import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  AdminDashboardModel,
  getAdminDashboardModel,
  AdminGlobalStats,
  UsersByCity,
  UsersByType,
  GlobalActivity,
  PlatformUser,
  RecentCollection
} from '@/models/AdminDashboardModel';

export interface AdminDashboardState {
  globalStats: AdminGlobalStats;
  usersByCity: UsersByCity[];
  usersByType: UsersByType[];
  recentActivities: GlobalActivity[];
  allUsers: PlatformUser[];
  recentCollections: RecentCollection[];
  environmentalImpact: {
    co2Avoided: number;
    treesEquivalent: number;
    bagsAvoided: number;
    waterSaved: number;
  };
  initialLoading: boolean;
  error: string | null;
}

const initialState: AdminDashboardState = {
  globalStats: {
    totalUsers: 0,
    totalWasteCollected: 0,
    totalCo2Reduced: 0,
    totalEconomicSavings: 0,
    pendingCollections: 0,
    completedCollections: 0,
    totalActivities: 0,
    activeUsersThisMonth: 0
  },
  usersByCity: [],
  usersByType: [],
  recentActivities: [],
  allUsers: [],
  recentCollections: [],
  environmentalImpact: {
    co2Avoided: 0,
    treesEquivalent: 0,
    bagsAvoided: 0,
    waterSaved: 0
  },
  initialLoading: true,
  error: null
};

export const useAdminDashboardController = (isAdmin: boolean) => {
  const [state, setState] = useState<AdminDashboardState>(initialState);
  const modelRef = useRef<AdminDashboardModel | null>(null);
  const initialLoadDone = useRef(false);
  const channelsRef = useRef<any[]>([]);

  // Cargar todos los datos
  const loadAllData = useCallback(async (showLoading = false) => {
    // Inicializar modelo si no existe
    if (!modelRef.current) {
      modelRef.current = getAdminDashboardModel();
    }

    const model = modelRef.current;
    if (!model || !isAdmin) {
      setState(prev => ({ ...prev, initialLoading: false, error: 'No autorizado' }));
      return;
    }

    if (showLoading) {
      setState(prev => ({ ...prev, initialLoading: true, error: null }));
    }

    try {
      const [globalStats, usersByCity, usersByType, recentActivities, allUsers, recentCollections, environmentalImpact] = await Promise.all([
        model.getGlobalStats(),
        model.getUsersByCity(),
        model.getUsersByType(),
        model.getRecentActivities(15),
        model.getAllUsers(),
        model.getRecentCollections(10),
        model.getGlobalEnvironmentalImpact()
      ]);

      setState({
        globalStats,
        usersByCity,
        usersByType,
        recentActivities,
        allUsers,
        recentCollections,
        environmentalImpact,
        initialLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
      setState(prev => ({
        ...prev,
        initialLoading: false,
        error: 'Error al cargar datos. Por favor, recarga la página.'
      }));
    }
  }, [isAdmin]);

  // Funciones de actualización silenciosas
  const refreshStats = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [globalStats, environmentalImpact] = await Promise.all([
        model.getGlobalStats(),
        model.getGlobalEnvironmentalImpact()
      ]);
      setState(prev => ({ ...prev, globalStats, environmentalImpact }));
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [usersByCity, usersByType, allUsers] = await Promise.all([
        model.getUsersByCity(),
        model.getUsersByType(),
        model.getAllUsers()
      ]);
      setState(prev => ({ ...prev, usersByCity, usersByType, allUsers }));
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  }, []);

  const refreshActivities = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const recentActivities = await model.getRecentActivities(15);
      setState(prev => ({ ...prev, recentActivities }));
    } catch (error) {
      console.error('Error refreshing activities:', error);
    }
  }, []);

  const refreshCollections = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [recentCollections, globalStats] = await Promise.all([
        model.getRecentCollections(10),
        model.getGlobalStats()
      ]);
      setState(prev => ({ ...prev, recentCollections, globalStats }));
    } catch (error) {
      console.error('Error refreshing collections:', error);
    }
  }, []);

  // Carga inicial - combinada con inicialización del modelo
  useEffect(() => {
    if (isAdmin && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllData(true);
    }
  }, [isAdmin, loadAllData]);

  // Timeout de seguridad para evitar loading infinito
  useEffect(() => {
    if (!isAdmin) return;

    const timeoutId = setTimeout(() => {
      if (state.initialLoading) {
        console.warn('Admin dashboard load timeout');
        setState(prev => ({
          ...prev,
          initialLoading: false,
          error: 'Tiempo de espera agotado. Por favor, recarga la página.'
        }));
      }
    }, 15000); // 15 segundos de timeout

    return () => clearTimeout(timeoutId);
  }, [isAdmin, state.initialLoading]);

  // Suscripciones en tiempo real
  useEffect(() => {
    if (!isAdmin) return;

    // Limpiar canales anteriores
    channelsRef.current.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error removing channel:', e);
      }
    });
    channelsRef.current = [];

    try {
      const channel1 = supabase
        .channel('admin-profiles-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refreshUsers)
        .subscribe();

      const channel2 = supabase
        .channel('admin-stats-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, refreshStats)
        .subscribe();

      const channel3 = supabase
        .channel('admin-collections-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, refreshCollections)
        .subscribe();

      const channel4 = supabase
        .channel('admin-activities-rt')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, refreshActivities)
        .subscribe();

      channelsRef.current = [channel1, channel2, channel3, channel4];
    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
    }

    return () => {
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Error removing channel on cleanup:', e);
        }
      });
      channelsRef.current = [];
    };
  }, [isAdmin, refreshStats, refreshUsers, refreshActivities, refreshCollections]);

  // Helpers
  const getTypeLabel = (type: string): string => {
    const types: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'market': 'Plaza de Mercado',
      'hotel': 'Hotel',
      'catering': 'Catering',
      'farm': 'Granja',
      'collection': 'Centro de Acopio',
      'other': 'Otro'
    };
    return types[type] || type;
  };

  const getCityLabel = (city: string): string => {
    const cities: { [key: string]: string } = {
      'pasto': 'Pasto',
      'ipiales': 'Ipiales',
      'tumaco': 'Tumaco',
      'tuquerres': 'Túquerres',
      'sandona': 'Sandoná',
      'la_union': 'La Unión',
      'samaniego': 'Samaniego',
      'other': 'Otro'
    };
    return cities[city?.toLowerCase()] || city;
  };

  const formatDateTime = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return {
    state,
    loadAllData: () => loadAllData(true),
    getTypeLabel,
    getCityLabel,
    formatDateTime
  };
};
