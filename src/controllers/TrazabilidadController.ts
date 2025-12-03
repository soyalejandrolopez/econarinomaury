import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  TrazabilidadModel,
  getTrazabilidadModel,
  TraceabilityStep,
  WasteBatch,
  ImpactMetrics,
  AccumulatedImpact,
  Beneficiary
} from '@/models/TrazabilidadModel';

export interface TrazabilidadState {
  traceabilitySteps: TraceabilityStep[];
  batches: WasteBatch[];
  impactMetrics: ImpactMetrics;
  accumulatedImpact: AccumulatedImpact;
  beneficiaries: Beneficiary[];
  lastCollection: { id: string; date: string; weight: number } | null;
  initialLoading: boolean;
}

const initialState: TrazabilidadState = {
  traceabilitySteps: [],
  batches: [],
  impactMetrics: {
    co2Avoided: 0,
    compostGenerated: 0,
    farmsHelped: 0,
    pointsEarned: 0
  },
  accumulatedImpact: {
    co2Avoided: 0,
    co2Goal: 500,
    wasteRecycled: 0,
    wasteGoal: 1000,
    compostGenerated: 0,
    compostGoal: 1000
  },
  beneficiaries: [],
  lastCollection: null,
  initialLoading: true
};

export const useTrazabilidadController = (userId: string | undefined) => {
  const [state, setState] = useState<TrazabilidadState>(initialState);
  const modelRef = useRef<TrazabilidadModel | null>(null);
  const initialLoadDone = useRef(false);
  const channelsRef = useRef<any[]>([]);

  // Inicializar modelo
  useEffect(() => {
    if (userId && !modelRef.current) {
      modelRef.current = getTrazabilidadModel(userId);
    }
  }, [userId]);

  // Cargar todos los datos
  const loadAllData = useCallback(async (showLoading = false) => {
    const model = modelRef.current;
    if (!model || !userId) return;

    if (showLoading) {
      setState(prev => ({ ...prev, initialLoading: true }));
    }

    try {
      const [traceabilitySteps, batches, impactMetrics, accumulatedImpact, beneficiaries, lastCollection] = await Promise.all([
        model.getTraceabilitySteps(),
        model.getBatches(),
        model.getImpactMetrics(),
        model.getAccumulatedImpact(),
        model.getBeneficiaries(),
        model.getLastCollection()
      ]);

      setState({
        traceabilitySteps,
        batches,
        impactMetrics,
        accumulatedImpact,
        beneficiaries,
        lastCollection,
        initialLoading: false
      });
    } catch (error) {
      console.error('Error loading traceability data:', error);
      setState(prev => ({ ...prev, initialLoading: false }));
    }
  }, [userId]);

  // Funciones de actualización silenciosas
  const refreshTraceability = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [traceabilitySteps, lastCollection] = await Promise.all([
        model.getTraceabilitySteps(),
        model.getLastCollection()
      ]);
      setState(prev => ({ ...prev, traceabilitySteps, lastCollection }));
    } catch (error) {
      console.error('Error refreshing traceability:', error);
    }
  }, []);

  const refreshBatches = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const batches = await model.getBatches();
      setState(prev => ({ ...prev, batches }));
    } catch (error) {
      console.error('Error refreshing batches:', error);
    }
  }, []);

  const refreshImpact = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [impactMetrics, accumulatedImpact, beneficiaries] = await Promise.all([
        model.getImpactMetrics(),
        model.getAccumulatedImpact(),
        model.getBeneficiaries()
      ]);
      setState(prev => ({ ...prev, impactMetrics, accumulatedImpact, beneficiaries }));
    } catch (error) {
      console.error('Error refreshing impact:', error);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    if (userId && modelRef.current && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllData(true);
    }
  }, [userId, loadAllData]);

  // Suscripciones en tiempo real
  useEffect(() => {
    if (!userId) return;

    // Limpiar canales anteriores
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    const channel1 = supabase
      .channel(`trazabilidad-collections-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'collections',
        filter: `user_id=eq.${userId}`
      }, () => {
        refreshTraceability();
        refreshBatches();
      })
      .subscribe();

    const channel2 = supabase
      .channel(`trazabilidad-stats-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`
      }, refreshImpact)
      .subscribe();

    channelsRef.current = [channel1, channel2];

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [userId, refreshTraceability, refreshBatches, refreshImpact]);

  // Helpers
  const getStepStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      'completed': 'Completado',
      'in_progress': 'En proceso',
      'pending': 'Pendiente'
    };
    return labels[status] || status;
  };

  const getBatchStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      'completed': 'Completado',
      'in_progress': 'En proceso'
    };
    return labels[status] || status;
  };

  const getCompletedStepsCount = (): number => {
    return state.traceabilitySteps.filter(s => s.status === 'completed').length;
  };

  const getTotalSteps = (): number => {
    return state.traceabilitySteps.length;
  };

  const getOverallProgress = (): number => {
    const total = getTotalSteps();
    if (total === 0) return 0;
    const completed = getCompletedStepsCount();
    const inProgress = state.traceabilitySteps.filter(s => s.status === 'in_progress').length;
    return Math.round(((completed + (inProgress * 0.5)) / total) * 100);
  };

  return {
    state,
    loadAllData: () => loadAllData(true),
    getStepStatusLabel,
    getBatchStatusLabel,
    getCompletedStepsCount,
    getTotalSteps,
    getOverallProgress
  };
};
