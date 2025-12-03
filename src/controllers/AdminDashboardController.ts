import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  AdminDashboardModel,
  getAdminDashboardModel,
  AdminGlobalStats,
  UsersByCity,
  UsersByType,
  GlobalActivity,
  PlatformUser,
  RecentCollection,
  MonthlyGrowth
} from '@/models/AdminDashboardModel';

export interface AdminDashboardState {
  globalStats: AdminGlobalStats;
  usersByCity: UsersByCity[];
  usersByType: UsersByType[];
  recentActivities: GlobalActivity[];
  allUsers: PlatformUser[];
  recentCollections: RecentCollection[];
  monthlyGrowth: MonthlyGrowth[];
  environmentalImpact: {
    co2Avoided: number;
    treesEquivalent: number;
    bagsAvoided: number;
    waterSaved: number;
  };
  loading: {
    stats: boolean;
    cities: boolean;
    types: boolean;
    activities: boolean;
    users: boolean;
    collections: boolean;
    growth: boolean;
    impact: boolean;
  };
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
  monthlyGrowth: [],
  environmentalImpact: {
    co2Avoided: 0,
    treesEquivalent: 0,
    bagsAvoided: 0,
    waterSaved: 0
  },
  loading: {
    stats: true,
    cities: true,
    types: true,
    activities: true,
    users: true,
    collections: true,
    growth: true,
    impact: true
  }
};

export const useAdminDashboardController = (isAdmin: boolean) => {
  const [state, setState] = useState<AdminDashboardState>(initialState);
  const [model] = useState<AdminDashboardModel>(() => getAdminDashboardModel());

  // Cargar estadísticas globales
  const loadGlobalStats = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, stats: true } }));

    try {
      const globalStats = await model.getGlobalStats();
      setState(prev => ({
        ...prev,
        globalStats,
        loading: { ...prev.loading, stats: false }
      }));
    } catch (error) {
      console.error('Error loading global stats:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, stats: false } }));
    }
  }, [isAdmin, model]);

  // Cargar usuarios por ciudad
  const loadUsersByCity = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, cities: true } }));

    try {
      const usersByCity = await model.getUsersByCity();
      setState(prev => ({
        ...prev,
        usersByCity,
        loading: { ...prev.loading, cities: false }
      }));
    } catch (error) {
      console.error('Error loading users by city:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, cities: false } }));
    }
  }, [isAdmin, model]);

  // Cargar usuarios por tipo
  const loadUsersByType = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, types: true } }));

    try {
      const usersByType = await model.getUsersByType();
      setState(prev => ({
        ...prev,
        usersByType,
        loading: { ...prev.loading, types: false }
      }));
    } catch (error) {
      console.error('Error loading users by type:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, types: false } }));
    }
  }, [isAdmin, model]);

  // Cargar actividades recientes
  const loadRecentActivities = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, activities: true } }));

    try {
      const recentActivities = await model.getRecentActivities(15);
      setState(prev => ({
        ...prev,
        recentActivities,
        loading: { ...prev.loading, activities: false }
      }));
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, activities: false } }));
    }
  }, [isAdmin, model]);

  // Cargar todos los usuarios
  const loadAllUsers = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, users: true } }));

    try {
      const allUsers = await model.getAllUsers();
      setState(prev => ({
        ...prev,
        allUsers,
        loading: { ...prev.loading, users: false }
      }));
    } catch (error) {
      console.error('Error loading all users:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, users: false } }));
    }
  }, [isAdmin, model]);

  // Cargar recolecciones recientes
  const loadRecentCollections = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, collections: true } }));

    try {
      const recentCollections = await model.getRecentCollections(10);
      setState(prev => ({
        ...prev,
        recentCollections,
        loading: { ...prev.loading, collections: false }
      }));
    } catch (error) {
      console.error('Error loading recent collections:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, collections: false } }));
    }
  }, [isAdmin, model]);

  // Cargar crecimiento mensual
  const loadMonthlyGrowth = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, growth: true } }));

    try {
      const monthlyGrowth = await model.getMonthlyGrowth();
      setState(prev => ({
        ...prev,
        monthlyGrowth,
        loading: { ...prev.loading, growth: false }
      }));
    } catch (error) {
      console.error('Error loading monthly growth:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, growth: false } }));
    }
  }, [isAdmin, model]);

  // Cargar impacto ambiental
  const loadEnvironmentalImpact = useCallback(async () => {
    if (!isAdmin) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, impact: true } }));

    try {
      const environmentalImpact = await model.getGlobalEnvironmentalImpact();
      setState(prev => ({
        ...prev,
        environmentalImpact,
        loading: { ...prev.loading, impact: false }
      }));
    } catch (error) {
      console.error('Error loading environmental impact:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, impact: false } }));
    }
  }, [isAdmin, model]);

  // Cargar todos los datos
  const loadAllData = useCallback(async () => {
    if (!isAdmin) return;

    await Promise.all([
      loadGlobalStats(),
      loadUsersByCity(),
      loadUsersByType(),
      loadRecentActivities(),
      loadAllUsers(),
      loadRecentCollections(),
      loadMonthlyGrowth(),
      loadEnvironmentalImpact()
    ]);
  }, [
    isAdmin,
    loadGlobalStats,
    loadUsersByCity,
    loadUsersByType,
    loadRecentActivities,
    loadAllUsers,
    loadRecentCollections,
    loadMonthlyGrowth,
    loadEnvironmentalImpact
  ]);

  // Cargar datos al montar
  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin, loadAllData]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!isAdmin) return;

    const channels = [
      supabase
        .channel('admin-profiles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          loadGlobalStats();
          loadUsersByCity();
          loadUsersByType();
          loadAllUsers();
        })
        .subscribe(),

      supabase
        .channel('admin-stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, () => {
          loadGlobalStats();
          loadUsersByCity();
          loadUsersByType();
          loadMonthlyGrowth();
          loadEnvironmentalImpact();
        })
        .subscribe(),

      supabase
        .channel('admin-collections')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, () => {
          loadGlobalStats();
          loadRecentCollections();
        })
        .subscribe(),

      supabase
        .channel('admin-activities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
          loadGlobalStats();
          loadRecentActivities();
        })
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [
    isAdmin,
    loadGlobalStats,
    loadUsersByCity,
    loadUsersByType,
    loadAllUsers,
    loadRecentCollections,
    loadRecentActivities,
    loadMonthlyGrowth,
    loadEnvironmentalImpact
  ]);

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

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLoading = Object.values(state.loading).some(v => v);

  return {
    state,
    loadAllData,
    loadGlobalStats,
    loadUsersByCity,
    loadUsersByType,
    loadRecentActivities,
    loadAllUsers,
    loadRecentCollections,
    loadMonthlyGrowth,
    loadEnvironmentalImpact,
    // Helpers
    getTypeLabel,
    getCityLabel,
    formatDate,
    formatDateTime,
    isLoading
  };
};
