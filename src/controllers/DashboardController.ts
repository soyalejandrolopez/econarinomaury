import { useState, useEffect, useCallback } from 'react';
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
  loading: {
    stats: boolean;
    monthly: boolean;
    waste: boolean;
    achievements: boolean;
    goal: boolean;
    impact: boolean;
    nextCollection: boolean;
  };
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
  loading: {
    stats: true,
    monthly: true,
    waste: true,
    achievements: true,
    goal: true,
    impact: true,
    nextCollection: true
  }
};

export const useDashboardController = (userId: string | undefined) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const [model, setModel] = useState<DashboardModel | null>(null);

  // Inicializar modelo cuando hay userId
  useEffect(() => {
    if (userId) {
      setModel(getDashboardModel(userId));
    }
  }, [userId]);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, stats: true } }));

    try {
      const [stats, monthlyChange] = await Promise.all([
        model.getStats(),
        model.getMonthlyChange()
      ]);

      setState(prev => ({
        ...prev,
        stats,
        monthlyChange,
        loading: { ...prev.loading, stats: false }
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, stats: false } }));
    }
  }, [model]);

  // Cargar datos mensuales
  const loadMonthlyData = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, monthly: true } }));

    try {
      const monthlyData = await model.getMonthlyData();
      setState(prev => ({
        ...prev,
        monthlyData,
        loading: { ...prev.loading, monthly: false }
      }));
    } catch (error) {
      console.error('Error loading monthly data:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, monthly: false } }));
    }
  }, [model]);

  // Cargar distribución de residuos
  const loadWasteByType = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, waste: true } }));

    try {
      const wasteByType = await model.getWasteByType();
      setState(prev => ({
        ...prev,
        wasteByType,
        loading: { ...prev.loading, waste: false }
      }));
    } catch (error) {
      console.error('Error loading waste by type:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, waste: false } }));
    }
  }, [model]);

  // Cargar logros
  const loadAchievements = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, achievements: true } }));

    try {
      const achievements = await model.getAchievements();
      setState(prev => ({
        ...prev,
        achievements,
        loading: { ...prev.loading, achievements: false }
      }));
    } catch (error) {
      console.error('Error loading achievements:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, achievements: false } }));
    }
  }, [model]);

  // Cargar meta actual
  const loadCurrentGoal = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, goal: true } }));

    try {
      const currentGoal = await model.getCurrentGoal();
      setState(prev => ({
        ...prev,
        currentGoal,
        loading: { ...prev.loading, goal: false }
      }));
    } catch (error) {
      console.error('Error loading goal:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, goal: false } }));
    }
  }, [model]);

  // Cargar impacto ambiental
  const loadEnvironmentalImpact = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, impact: true } }));

    try {
      const environmentalImpact = await model.getEnvironmentalImpact();
      setState(prev => ({
        ...prev,
        environmentalImpact,
        loading: { ...prev.loading, impact: false }
      }));
    } catch (error) {
      console.error('Error loading impact:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, impact: false } }));
    }
  }, [model]);

  // Cargar próxima recolección
  const loadNextCollection = useCallback(async () => {
    if (!model) return;

    setState(prev => ({ ...prev, loading: { ...prev.loading, nextCollection: true } }));

    try {
      const nextCollection = await model.getNextCollection();
      setState(prev => ({
        ...prev,
        nextCollection,
        loading: { ...prev.loading, nextCollection: false }
      }));
    } catch (error) {
      console.error('Error loading next collection:', error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, nextCollection: false } }));
    }
  }, [model]);

  // Cargar todos los datos
  const loadAllData = useCallback(async () => {
    if (!model) return;

    await Promise.all([
      loadStats(),
      loadMonthlyData(),
      loadWasteByType(),
      loadAchievements(),
      loadCurrentGoal(),
      loadEnvironmentalImpact(),
      loadNextCollection()
    ]);
  }, [model, loadStats, loadMonthlyData, loadWasteByType, loadAchievements, loadCurrentGoal, loadEnvironmentalImpact, loadNextCollection]);

  // Cargar datos cuando el modelo esté listo
  useEffect(() => {
    if (model) {
      loadAllData();
    }
  }, [model, loadAllData]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!userId) return;

    const channels = [
      supabase
        .channel('user_stats-dashboard')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${userId}`
        }, () => {
          loadStats();
          loadMonthlyData();
          loadEnvironmentalImpact();
        })
        .subscribe(),

      supabase
        .channel('collections-dashboard')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'collections',
          filter: `user_id=eq.${userId}`
        }, () => {
          loadWasteByType();
          loadNextCollection();
          loadAchievements();
        })
        .subscribe(),

      supabase
        .channel('activities-dashboard')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${userId}`
        }, () => {
          loadAchievements();
        })
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId, loadStats, loadMonthlyData, loadWasteByType, loadAchievements, loadEnvironmentalImpact, loadNextCollection]);

  // Helpers para la vista
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatNextCollectionDate = (): string => {
    if (!state.nextCollection) return 'Sin recolecciones programadas';

    const date = new Date(state.nextCollection.date);
    return `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} - ${state.nextCollection.time}`;
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
    loadAllData,
    loadStats,
    loadMonthlyData,
    loadWasteByType,
    loadAchievements,
    loadCurrentGoal,
    loadEnvironmentalImpact,
    loadNextCollection,
    // Helpers
    getGreeting,
    formatDate,
    formatNextCollectionDate,
    getGoalProgress,
    getGoalRemaining,
    getUnlockedAchievementsCount,
    getTotalWaste
  };
};
