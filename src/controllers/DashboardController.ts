import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  DashboardModel,
  getDashboardModel,
  UserStats,
  MonthlyData,
  WasteByType,
  Achievement,
  UserGoal,
  EnvironmentalImpact,
  NextCollection
} from '@/models/DashboardModel';

export interface DashboardState {
  stats: UserStats;
  monthlyData: MonthlyData[];
  wasteByType: WasteByType[];
  achievements: Achievement[];
  currentGoal: UserGoal | null;
  environmentalImpact: EnvironmentalImpact;
  nextCollection: NextCollection | null;
  monthlyChange: { waste: number; co2: number; savings: number };
  initialLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    wasteCollected: 0,
    co2Reduced: 0,
    economicSavings: 0,
    sustainabilityPoints: 0
  },
  monthlyData: [],
  wasteByType: [],
  achievements: [],
  currentGoal: null,
  environmentalImpact: {
    co2Avoided: 0,
    treesEquivalent: 0,
    bagsAvoided: 0
  },
  nextCollection: null,
  monthlyChange: { waste: 0, co2: 0, savings: 0 },
  initialLoading: true,
  error: null
};

export const useDashboardController = (userId: string | undefined) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const modelRef = useRef<DashboardModel | null>(null);
  const initialLoadDone = useRef(false);
  const channelsRef = useRef<any[]>([]);

  // Función para cargar todos los datos
  const loadAllData = useCallback(async (showLoading = false) => {
    if (!userId) {
      setState(prev => ({ ...prev, initialLoading: false, error: 'Usuario no identificado' }));
      return;
    }

    // Inicializar modelo si no existe
    if (!modelRef.current) {
      modelRef.current = getDashboardModel(userId);
    }

    const model = modelRef.current;
    if (!model) {
      setState(prev => ({ ...prev, initialLoading: false, error: 'Error inicializando modelo' }));
      return;
    }

    if (showLoading) {
      setState(prev => ({ ...prev, initialLoading: true, error: null }));
    }

    try {
      const [stats, monthlyChange, monthlyData, wasteByType, achievements, currentGoal, environmentalImpact, nextCollection] = await Promise.all([
        model.getStats(),
        model.getMonthlyChange(),
        model.getMonthlyData(),
        model.getWasteByType(),
        model.getAchievements(),
        model.getCurrentGoal(),
        model.getEnvironmentalImpact(),
        model.getNextCollection()
      ]);

      setState({
        stats,
        monthlyChange,
        monthlyData,
        wasteByType,
        achievements,
        currentGoal,
        environmentalImpact,
        nextCollection,
        initialLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setState(prev => ({
        ...prev,
        initialLoading: false,
        error: 'Error al cargar datos. Por favor, recarga la página.'
      }));
    }
  }, [userId]);

  // Funciones de actualización silenciosas (sin loading spinner)
  const refreshStats = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [stats, monthlyChange, environmentalImpact] = await Promise.all([
        model.getStats(),
        model.getMonthlyChange(),
        model.getEnvironmentalImpact()
      ]);
      setState(prev => ({ ...prev, stats, monthlyChange, environmentalImpact }));
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);

  const refreshCollections = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [wasteByType, nextCollection, achievements] = await Promise.all([
        model.getWasteByType(),
        model.getNextCollection(),
        model.getAchievements()
      ]);
      setState(prev => ({ ...prev, wasteByType, nextCollection, achievements }));
    } catch (error) {
      console.error('Error refreshing collections:', error);
    }
  }, []);

  const refreshAchievements = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const achievements = await model.getAchievements();
      setState(prev => ({ ...prev, achievements }));
    } catch (error) {
      console.error('Error refreshing achievements:', error);
    }
  }, []);

  // Carga inicial - combinada con inicialización del modelo
  useEffect(() => {
    if (userId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllData(true);
    }
  }, [userId, loadAllData]);

  // Timeout de seguridad para evitar loading infinito
  useEffect(() => {
    if (!userId) return;

    const timeoutId = setTimeout(() => {
      if (state.initialLoading) {
        console.warn('Dashboard load timeout');
        setState(prev => ({
          ...prev,
          initialLoading: false,
          error: 'Tiempo de espera agotado. Por favor, recarga la página.'
        }));
      }
    }, 15000); // 15 segundos de timeout

    return () => clearTimeout(timeoutId);
  }, [userId, state.initialLoading]);

  // Suscripciones en tiempo real (solo configurar una vez)
  useEffect(() => {
    if (!userId) return;

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
        .channel(`user_stats-${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${userId}`
        }, refreshStats)
        .subscribe();

      const channel2 = supabase
        .channel(`collections-${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'collections'
        }, refreshCollections)
        .subscribe();

      const channel3 = supabase
        .channel(`activities-${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${userId}`
        }, refreshAchievements)
        .subscribe();

      channelsRef.current = [channel1, channel2, channel3];
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
  }, [userId, refreshStats, refreshCollections, refreshAchievements]);

  // Helpers
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatNextCollectionDate = (): string => {
    if (!state.nextCollection) return 'Sin recolecciones programadas';
    try {
      const date = new Date(state.nextCollection.date);
      return `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} - ${state.nextCollection.time}`;
    } catch {
      return 'Sin recolecciones programadas';
    }
  };

  const getGoalProgress = (): number => {
    if (!state.currentGoal) return 0;
    return Math.min((state.currentGoal.currentAmount / state.currentGoal.targetAmount) * 100, 100);
  };

  const getGoalRemaining = (): number => {
    if (!state.currentGoal) return 0;
    return Math.max(state.currentGoal.targetAmount - state.currentGoal.currentAmount, 0);
  };

  const getUnlockedAchievementsCount = (): { unlocked: number; total: number } => {
    const unlocked = state.achievements.filter(a => a.unlocked).length;
    return { unlocked, total: state.achievements.length };
  };

  const getTotalWaste = (): number => {
    return Math.round(state.stats.wasteCollected);
  };

  return {
    state,
    loadAllData: () => loadAllData(true),
    getGreeting,
    formatNextCollectionDate,
    getGoalProgress,
    getGoalRemaining,
    getUnlockedAchievementsCount,
    getTotalWaste
  };
};
