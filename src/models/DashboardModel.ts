import { supabase } from '@/lib/supabase';

// Interfaces del modelo
export interface UserStats {
  wasteCollected: number;
  co2Reduced: number;
  economicSavings: number;
  sustainabilityPoints: number;
}

export interface MonthlyData {
  month: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface WasteByType {
  type: string;
  value: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserGoal {
  id: string;
  targetAmount: number;
  currentAmount: number;
  month: string;
  year: number;
}

export interface EnvironmentalImpact {
  co2Avoided: number;
  treesEquivalent: number;
  bagsAvoided: number;
}

export interface NextCollection {
  date: string;
  time: string;
  wasteType: string;
  estimatedWeight: number;
}

// Clase del Modelo Dashboard
export class DashboardModel {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Obtener estadísticas del usuario
  async getStats(): Promise<UserStats> {
    const { data, error } = await supabase
      .from('user_stats')
      .select('waste_collected, co2_reduced, economic_savings, sustainability_points')
      .eq('user_id', this.userId);

    if (error || !data || data.length === 0) {
      return {
        wasteCollected: 0,
        co2Reduced: 0,
        economicSavings: 0,
        sustainabilityPoints: 0
      };
    }

    // Sumar todas las estadísticas mensuales
    return data.reduce((acc, curr) => ({
      wasteCollected: acc.wasteCollected + (curr.waste_collected || 0),
      co2Reduced: acc.co2Reduced + (curr.co2_reduced || 0),
      economicSavings: acc.economicSavings + (curr.economic_savings || 0),
      sustainabilityPoints: acc.sustainabilityPoints + (curr.sustainability_points || 0)
    }), {
      wasteCollected: 0,
      co2Reduced: 0,
      economicSavings: 0,
      sustainabilityPoints: 0
    });
  }

  // Obtener datos mensuales para gráfico
  async getMonthlyData(): Promise<MonthlyData[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data, error } = await supabase
      .from('user_stats')
      .select('month, waste_collected')
      .eq('user_id', this.userId)
      .gte('month', sixMonthsAgo.toISOString().split('T')[0])
      .order('month', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return data.map((item, index, arr) => {
      const date = new Date(item.month);
      const prevValue = index > 0 ? arr[index - 1].waste_collected : item.waste_collected;

      return {
        month: monthNames[date.getMonth()],
        value: item.waste_collected || 0,
        trend: item.waste_collected > prevValue ? 'up' : item.waste_collected < prevValue ? 'down' : 'stable'
      };
    });
  }

  // Obtener distribución de residuos por tipo
  async getWasteByType(): Promise<WasteByType[]> {
    const { data, error } = await supabase
      .from('collections')
      .select('waste_type, estimated_weight')
      .eq('user_id', this.userId)
      .eq('status', 'completed');

    if (error || !data || data.length === 0) {
      return [];
    }

    const typeColors: { [key: string]: string } = {
      'organico': 'bg-primary',
      'compostable': 'bg-secondary',
      'reciclable': 'bg-accent',
      'mixto': 'bg-warning',
      'otro': 'bg-muted'
    };

    // Agrupar por tipo
    const grouped = data.reduce((acc, curr) => {
      const type = curr.waste_type || 'otro';
      acc[type] = (acc[type] || 0) + (curr.estimated_weight || 0);
      return acc;
    }, {} as { [key: string]: number });

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);

    return Object.entries(grouped).map(([type, value]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: typeColors[type.toLowerCase()] || 'bg-muted'
    }));
  }

  // Obtener logros del usuario
  async getAchievements(): Promise<Achievement[]> {
    const stats = await this.getStats();
    const { data: collections } = await supabase
      .from('collections')
      .select('id')
      .eq('user_id', this.userId)
      .eq('status', 'completed');

    const { data: activities } = await supabase
      .from('activities')
      .select('created_at')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: true })
      .limit(1);

    const completedCollections = collections?.length || 0;
    const firstActivityDate = activities?.[0]?.created_at;
    const daysSinceFirstActivity = firstActivityDate
      ? Math.floor((Date.now() - new Date(firstActivityDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return [
      {
        id: 'first-week',
        title: 'Primera Semana',
        description: 'Completaste tu primera semana activa',
        icon: 'Star',
        unlocked: daysSinceFirstActivity >= 7
      },
      {
        id: 'eco-warrior',
        title: 'Eco Warrior',
        description: '100 kg de residuos aprovechados',
        icon: 'Award',
        unlocked: stats.wasteCollected >= 100
      },
      {
        id: 'goal-achieved',
        title: 'Meta Cumplida',
        description: 'Alcanzaste tu primera meta mensual',
        icon: 'Target',
        unlocked: stats.wasteCollected >= 50
      },
      {
        id: 'super-active',
        title: 'Súper Activo',
        description: '10 recolecciones programadas',
        icon: 'Zap',
        unlocked: completedCollections >= 10
      },
      {
        id: 'green-champion',
        title: 'Campeón Verde',
        description: '500 kg de CO₂ reducido',
        icon: 'Leaf',
        unlocked: stats.co2Reduced >= 500
      },
      {
        id: 'community-leader',
        title: 'Líder Comunitario',
        description: '1000 puntos de sostenibilidad',
        icon: 'Users',
        unlocked: stats.sustainabilityPoints >= 1000
      }
    ];
  }

  // Obtener meta del mes actual
  async getCurrentGoal(): Promise<UserGoal | null> {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM

    const { data: goal } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', this.userId)
      .gte('target_date', `${currentMonth}-01`)
      .lte('target_date', `${currentMonth}-31`)
      .single();

    if (!goal) {
      // Retornar meta por defecto basada en estadísticas
      const stats = await this.getStats();
      return {
        id: 'default',
        targetAmount: 100, // Meta por defecto: 100 kg
        currentAmount: stats.wasteCollected,
        month: now.toLocaleString('es-ES', { month: 'long' }),
        year: now.getFullYear()
      };
    }

    const stats = await this.getStats();
    return {
      id: goal.id,
      targetAmount: goal.target_amount || 100,
      currentAmount: stats.wasteCollected,
      month: now.toLocaleString('es-ES', { month: 'long' }),
      year: now.getFullYear()
    };
  }

  // Calcular impacto ambiental
  async getEnvironmentalImpact(): Promise<EnvironmentalImpact> {
    const stats = await this.getStats();

    return {
      co2Avoided: Math.round(stats.co2Reduced),
      treesEquivalent: Math.round(stats.co2Reduced / 21), // ~21 kg CO2 por árbol/año
      bagsAvoided: Math.round(stats.wasteCollected / 5) // ~5 kg por bolsa
    };
  }

  // Obtener próxima recolección
  async getNextCollection(): Promise<NextCollection | null> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('collections')
      .select('date, time, waste_type, estimated_weight')
      .eq('user_id', this.userId)
      .eq('status', 'pending')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      date: data.date,
      time: data.time,
      wasteType: data.waste_type,
      estimatedWeight: data.estimated_weight
    };
  }

  // Calcular cambio porcentual vs mes anterior
  async getMonthlyChange(): Promise<{ waste: number; co2: number; savings: number }> {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const { data: thisMonthData } = await supabase
      .from('user_stats')
      .select('waste_collected, co2_reduced, economic_savings')
      .eq('user_id', this.userId)
      .gte('month', thisMonth.toISOString().split('T')[0])
      .single();

    const { data: lastMonthData } = await supabase
      .from('user_stats')
      .select('waste_collected, co2_reduced, economic_savings')
      .eq('user_id', this.userId)
      .gte('month', lastMonth.toISOString().split('T')[0])
      .lt('month', thisMonth.toISOString().split('T')[0])
      .single();

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      waste: calcChange(thisMonthData?.waste_collected || 0, lastMonthData?.waste_collected || 0),
      co2: calcChange(thisMonthData?.co2_reduced || 0, lastMonthData?.co2_reduced || 0),
      savings: calcChange(thisMonthData?.economic_savings || 0, lastMonthData?.economic_savings || 0)
    };
  }
}

// Singleton para acceso global
let dashboardModelInstance: DashboardModel | null = null;

export const getDashboardModel = (userId: string): DashboardModel => {
  if (!dashboardModelInstance || dashboardModelInstance['userId'] !== userId) {
    dashboardModelInstance = new DashboardModel(userId);
  }
  return dashboardModelInstance;
};
