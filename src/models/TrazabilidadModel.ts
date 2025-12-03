import { supabase } from '@/lib/supabase';

// Interfaces
export interface TraceabilityStep {
  step: number;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  location: string;
  date: string;
  time: string;
  details: string;
}

export interface WasteBatch {
  id: string;
  date: string;
  weight: number;
  type: string;
  status: 'in_progress' | 'completed';
  progress: number;
  destination: string;
}

export interface ImpactMetrics {
  co2Avoided: number;
  compostGenerated: number;
  farmsHelped: number;
  pointsEarned: number;
}

export interface AccumulatedImpact {
  co2Avoided: number;
  co2Goal: number;
  wasteRecycled: number;
  wasteGoal: number;
  compostGenerated: number;
  compostGoal: number;
}

export interface Beneficiary {
  type: 'farms' | 'processing' | 'routes';
  label: string;
  description: string;
  count: number;
}

// Modelo
export class TrazabilidadModel {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Obtener pasos de trazabilidad para la última recolección
  async getTraceabilitySteps(collectionId?: string): Promise<TraceabilityStep[]> {
    try {
      // Si no se proporciona ID, obtener la última recolección
      let collection;
      if (collectionId) {
        const { data } = await supabase
          .from('collections')
          .select('*')
          .eq('id', collectionId)
          .eq('user_id', this.userId)
          .single();
        collection = data;
      } else {
        const { data } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', this.userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        collection = data;
      }

      if (!collection) {
        return this.getDefaultSteps();
      }

      // Obtener perfil del usuario para el establecimiento
      const { data: profile } = await supabase
        .from('profiles')
        .select('establishment')
        .eq('id', this.userId)
        .single();

      const collectionDate = new Date(collection.date);
      const formattedDate = collectionDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
      const isCompleted = collection.status === 'completed';
      const isPending = collection.status === 'pending';

      // Calcular fechas estimadas
      const processingDate = new Date(collectionDate);
      processingDate.setDate(processingDate.getDate() + 1);

      const transformDate = new Date(collectionDate);
      transformDate.setDate(transformDate.getDate() + 3);

      const distributionDate = new Date(collectionDate);
      distributionDate.setDate(distributionDate.getDate() + 7);

      return [
        {
          step: 1,
          title: 'Generación',
          status: 'completed',
          location: profile?.establishment || 'Tu establecimiento',
          date: formattedDate,
          time: collection.time || '07:30 AM',
          details: `${collection.estimated_weight || 0} kg de residuos ${collection.waste_type || 'orgánicos'} clasificados`
        },
        {
          step: 2,
          title: 'Recolección',
          status: isCompleted ? 'completed' : isPending ? 'pending' : 'in_progress',
          location: 'Ruta de recolección asignada',
          date: formattedDate,
          time: collection.time || '09:00 AM',
          details: isCompleted ? 'Residuos recogidos y verificados' : 'Pendiente de recolección'
        },
        {
          step: 3,
          title: 'Procesamiento',
          status: isCompleted ? 'completed' : 'pending',
          location: 'Centro de Acopio EcoNariño',
          date: processingDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          time: isCompleted ? '11:30 AM' : '-',
          details: isCompleted ? 'Clasificación final completada' : 'En espera de procesamiento'
        },
        {
          step: 4,
          title: 'Transformación',
          status: 'pending',
          location: 'Planta de Compostaje EcoNariño',
          date: `Estimado: ${transformDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
          time: '-',
          details: 'Conversión a compost orgánico'
        },
        {
          step: 5,
          title: 'Distribución',
          status: 'pending',
          location: 'Granjas asociadas',
          date: `Estimado: ${distributionDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
          time: '-',
          details: 'Entrega a productores agrícolas'
        }
      ];
    } catch (error) {
      console.error('Error getting traceability steps:', error);
      return this.getDefaultSteps();
    }
  }

  private getDefaultSteps(): TraceabilityStep[] {
    return [
      {
        step: 1,
        title: 'Generación',
        status: 'pending',
        location: 'Tu establecimiento',
        date: '-',
        time: '-',
        details: 'Programa tu primera recolección'
      }
    ];
  }

  // Obtener lotes de residuos del usuario
  async getBatches(): Promise<WasteBatch[]> {
    try {
      const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !collections || collections.length === 0) {
        return [];
      }

      return collections.map(col => {
        const isCompleted = col.status === 'completed';
        const progress = isCompleted ? 100 : col.status === 'pending' ? 0 : 60;

        return {
          id: `ECO-${new Date(col.created_at).getFullYear()}-${col.id.slice(0, 4).toUpperCase()}`,
          date: new Date(col.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          weight: col.estimated_weight || 0,
          type: col.waste_type || 'Orgánicos',
          status: isCompleted ? 'completed' : 'in_progress',
          progress,
          destination: col.waste_type === 'compostable' ? 'Alimento Animal' : 'Compostaje'
        };
      });
    } catch (error) {
      console.error('Error getting batches:', error);
      return [];
    }
  }

  // Obtener métricas de impacto
  async getImpactMetrics(): Promise<ImpactMetrics> {
    try {
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('waste_collected, co2_reduced, sustainability_points')
        .eq('user_id', this.userId);

      const stats = statsData?.reduce((acc, curr) => ({
        wasteCollected: acc.wasteCollected + (curr.waste_collected || 0),
        co2Reduced: acc.co2Reduced + (curr.co2_reduced || 0),
        sustainabilityPoints: acc.sustainabilityPoints + (curr.sustainability_points || 0)
      }), { wasteCollected: 0, co2Reduced: 0, sustainabilityPoints: 0 }) || { wasteCollected: 0, co2Reduced: 0, sustainabilityPoints: 0 };

      // Estimar compost (aproximadamente 80% del peso de residuos)
      const compostGenerated = Math.round(stats.wasteCollected * 0.8);

      // Estimar granjas beneficiadas (1 granja por cada 100kg de compost)
      const farmsHelped = Math.max(1, Math.floor(compostGenerated / 100));

      return {
        co2Avoided: Math.round(stats.co2Reduced),
        compostGenerated,
        farmsHelped,
        pointsEarned: stats.sustainabilityPoints
      };
    } catch (error) {
      console.error('Error getting impact metrics:', error);
      return {
        co2Avoided: 0,
        compostGenerated: 0,
        farmsHelped: 0,
        pointsEarned: 0
      };
    }
  }

  // Obtener impacto acumulado con metas
  async getAccumulatedImpact(): Promise<AccumulatedImpact> {
    try {
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('waste_collected, co2_reduced')
        .eq('user_id', this.userId);

      const stats = statsData?.reduce((acc, curr) => ({
        wasteCollected: acc.wasteCollected + (curr.waste_collected || 0),
        co2Reduced: acc.co2Reduced + (curr.co2_reduced || 0)
      }), { wasteCollected: 0, co2Reduced: 0 }) || { wasteCollected: 0, co2Reduced: 0 };

      const compostGenerated = Math.round(stats.wasteCollected * 0.8);

      return {
        co2Avoided: Math.round(stats.co2Reduced),
        co2Goal: 500,
        wasteRecycled: Math.round(stats.wasteCollected),
        wasteGoal: 1000,
        compostGenerated,
        compostGoal: 1000
      };
    } catch (error) {
      console.error('Error getting accumulated impact:', error);
      return {
        co2Avoided: 0,
        co2Goal: 500,
        wasteRecycled: 0,
        wasteGoal: 1000,
        compostGenerated: 0,
        compostGoal: 1000
      };
    }
  }

  // Obtener beneficiarios del programa
  async getBeneficiaries(): Promise<Beneficiary[]> {
    try {
      const metrics = await this.getImpactMetrics();

      // Contar rutas (recolecciones únicas por fecha)
      const { data: collections } = await supabase
        .from('collections')
        .select('date')
        .eq('user_id', this.userId)
        .eq('status', 'completed');

      const uniqueDates = new Set(collections?.map(c => c.date) || []);
      const routesCount = Math.max(1, Math.ceil(uniqueDates.size / 5)); // 1 ruta por cada 5 días de recolección

      return [
        {
          type: 'farms',
          label: 'Granjas Beneficiadas',
          description: 'Reciben compost y alimento',
          count: metrics.farmsHelped
        },
        {
          type: 'processing',
          label: 'Centros de Procesamiento',
          description: 'Transforman los residuos',
          count: Math.min(3, Math.max(1, Math.floor(metrics.compostGenerated / 500)))
        },
        {
          type: 'routes',
          label: 'Rutas de Recolección',
          description: 'Vehículos asignados',
          count: routesCount
        }
      ];
    } catch (error) {
      console.error('Error getting beneficiaries:', error);
      return [
        { type: 'farms', label: 'Granjas Beneficiadas', description: 'Reciben compost y alimento', count: 0 },
        { type: 'processing', label: 'Centros de Procesamiento', description: 'Transforman los residuos', count: 0 },
        { type: 'routes', label: 'Rutas de Recolección', description: 'Vehículos asignados', count: 0 }
      ];
    }
  }

  // Obtener última recolección
  async getLastCollection(): Promise<{ id: string; date: string; weight: number } | null> {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, date, estimated_weight')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        id: `ECO-${new Date().getFullYear()}-${data.id.slice(0, 4).toUpperCase()}`,
        date: new Date(data.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        weight: data.estimated_weight || 0
      };
    } catch (error) {
      console.error('Error getting last collection:', error);
      return null;
    }
  }
}

// Singleton con userId
let trazabilidadModelInstance: TrazabilidadModel | null = null;
let currentUserId: string | null = null;

export const getTrazabilidadModel = (userId: string): TrazabilidadModel => {
  if (!trazabilidadModelInstance || currentUserId !== userId) {
    trazabilidadModelInstance = new TrazabilidadModel(userId);
    currentUserId = userId;
  }
  return trazabilidadModelInstance;
};
