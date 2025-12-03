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
  initialLoading: true
};

export const useDashboardController = (userId: string | undefined) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const modelRef = useRef<DashboardModel | null>(null);
  const initialLoadDone = useRef(false);
  const channelsRef = useRef<any[]>([]);

  // Inicializar modelo
  useEffect(() => {
    if (userId && !modelRef.current) {
      modelRef.current = getDashboardModel(userId);
    }
  }, [userId]);

  // Función para cargar todos los datos (sin setState de loading individual)
  const loadAllData = useCallback(async (showLoading = false) => {
    const model = modelRef.current;
    if (!model) return;

    if (showLoading) {
      setState(prev => ({ ...prev, initialLoading: true }));
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
        initialLoading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setState(prev => ({ ...prev, initialLoading: false }));
    }
  }, []);

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

  // Carga inicial
  useEffect(() => {
    if (userId && modelRef.current && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllData(true);
    }
  }, [userId, loadAllData]);

  // Suscripciones en tiempo real (solo configurar una vez)
  useEffect(() => {
    if (!userId) return;

    // Limpiar canales anteriores
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

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

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
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
    loadAllData: () => loadAllData(true),
    getGreeting,
    formatNextCollectionDate,
    getGoalProgress,
    getGoalRemaining,
    getUnlockedAchievementsCount,
    getTotalWaste
  };
};
