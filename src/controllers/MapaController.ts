import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  MapaModel,
  getMapaModel,
  Municipio,
  PuntoAcopio,
  RutaRecoleccion,
  EstadisticasMapa
} from '@/models/MapaModel';

export interface MapaState {
  estadisticas: EstadisticasMapa;
  municipios: Municipio[];
  puntosAcopio: PuntoAcopio[];
  rutas: RutaRecoleccion[];
  initialLoading: boolean;
}

const initialState: MapaState = {
  estadisticas: {
    municipiosActivos: 0,
    puntosRecoleccion: 0,
    vehiculosEnRuta: 0,
    totalWasteCollected: 0,
    totalUsers: 0
  },
  municipios: [],
  puntosAcopio: [],
  rutas: [],
  initialLoading: true
};

export const useMapaController = () => {
  const [state, setState] = useState<MapaState>(initialState);
  const modelRef = useRef<MapaModel | null>(null);
  const initialLoadDone = useRef(false);
  const channelsRef = useRef<any[]>([]);

  // Inicializar modelo
  useEffect(() => {
    if (!modelRef.current) {
      modelRef.current = getMapaModel();
    }
  }, []);

  // Cargar todos los datos
  const loadAllData = useCallback(async (showLoading = false) => {
    const model = modelRef.current;
    if (!model) return;

    if (showLoading) {
      setState(prev => ({ ...prev, initialLoading: true }));
    }

    try {
      const [estadisticas, municipios, puntosAcopio, rutas] = await Promise.all([
        model.getEstadisticas(),
        model.getMunicipios(),
        model.getPuntosAcopio(),
        model.getRutas()
      ]);

      setState({
        estadisticas,
        municipios,
        puntosAcopio,
        rutas,
        initialLoading: false
      });
    } catch (error) {
      console.error('Error loading map data:', error);
      setState(prev => ({ ...prev, initialLoading: false }));
    }
  }, []);

  // Funciones de actualización silenciosas
  const refreshEstadisticas = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const estadisticas = await model.getEstadisticas();
      setState(prev => ({ ...prev, estadisticas }));
    } catch (error) {
      console.error('Error refreshing statistics:', error);
    }
  }, []);

  const refreshMunicipios = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const [municipios, estadisticas] = await Promise.all([
        model.getMunicipios(),
        model.getEstadisticas()
      ]);
      setState(prev => ({ ...prev, municipios, estadisticas }));
    } catch (error) {
      console.error('Error refreshing municipalities:', error);
    }
  }, []);

  const refreshRutas = useCallback(async () => {
    const model = modelRef.current;
    if (!model) return;

    try {
      const rutas = await model.getRutas();
      setState(prev => ({ ...prev, rutas }));
    } catch (error) {
      console.error('Error refreshing routes:', error);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    if (modelRef.current && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadAllData(true);
    }
  }, [loadAllData]);

  // Suscripciones en tiempo real
  useEffect(() => {
    // Limpiar canales anteriores
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    const channel1 = supabase
      .channel('mapa-profiles-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refreshMunicipios)
      .subscribe();

    const channel2 = supabase
      .channel('mapa-collections-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, refreshRutas)
      .subscribe();

    const channel3 = supabase
      .channel('mapa-stats-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, refreshEstadisticas)
      .subscribe();

    channelsRef.current = [channel1, channel2, channel3];

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [refreshMunicipios, refreshRutas, refreshEstadisticas]);

  // Helpers
  const getCityLabel = (city: string): string => {
    const cities: { [key: string]: string } = {
      'pasto': 'Pasto',
      'ipiales': 'Ipiales',
      'tumaco': 'Tumaco',
      'tuquerres': 'Túquerres',
      'sandona': 'Sandoná',
      'la_union': 'La Unión',
      'samaniego': 'Samaniego',
      'other': 'Otros'
    };
    return cities[city?.toLowerCase()] || city;
  };

  const getRouteStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      'in_progress': 'En progreso',
      'scheduled': 'Programada',
      'completed': 'Completada'
    };
    return labels[status] || status;
  };

  const getActiveRoutesCount = (): number => {
    return state.rutas.filter(r => r.status === 'in_progress').length;
  };

  return {
    state,
    loadAllData: () => loadAllData(true),
    getCityLabel,
    getRouteStatusLabel,
    getActiveRoutesCount
  };
};
