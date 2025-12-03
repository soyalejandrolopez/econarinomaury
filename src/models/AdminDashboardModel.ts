import { supabase } from '@/lib/supabase';

// Interfaces del modelo Admin
export interface AdminGlobalStats {
  totalUsers: number;
  totalWasteCollected: number;
  totalCo2Reduced: number;
  totalEconomicSavings: number;
  pendingCollections: number;
  completedCollections: number;
  totalActivities: number;
  activeUsersThisMonth: number;
}

export interface UsersByCity {
  city: string;
  userCount: number;
  totalWaste: number;
  totalCo2: number;
}

export interface UsersByType {
  type: string;
  count: number;
  totalWaste: number;
}

export interface GlobalActivity {
  id: string;
  userName: string;
  establishment: string;
  action: string;
  amount: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  establishment: string;
  type: string;
  city: string;
  role: string;
  createdAt: string;
  totalWaste: number;
}

export interface RecentCollection {
  id: string;
  userId: string;
  userName: string;
  establishment: string;
  date: string;
  time: string;
  wasteType: string;
  estimatedWeight: number;
  status: string;
}

export interface MonthlyGrowth {
  month: string;
  newUsers: number;
  totalWaste: number;
}

// Clase del Modelo Admin Dashboard
export class AdminDashboardModel {

  // Obtener estadísticas globales
  async getGlobalStats(): Promise<AdminGlobalStats> {
    try {
      // Total usuarios (no admin)
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

      // Estadísticas agregadas
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('waste_collected, co2_reduced, economic_savings');

      const totals = statsData?.reduce((acc, curr) => ({
        waste: acc.waste + (curr.waste_collected || 0),
        co2: acc.co2 + (curr.co2_reduced || 0),
        savings: acc.savings + (curr.economic_savings || 0)
      }), { waste: 0, co2: 0, savings: 0 }) || { waste: 0, co2: 0, savings: 0 };

      // Recolecciones
      const { count: pendingCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: completedCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Actividades
      const { count: activityCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true });

      // Usuarios activos este mes
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: activeUsers } = await supabase
        .from('activities')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      return {
        totalUsers: userCount || 0,
        totalWasteCollected: totals.waste,
        totalCo2Reduced: totals.co2,
        totalEconomicSavings: totals.savings,
        pendingCollections: pendingCount || 0,
        completedCollections: completedCount || 0,
        totalActivities: activityCount || 0,
        activeUsersThisMonth: activeUsers || 0
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return {
        totalUsers: 0,
        totalWasteCollected: 0,
        totalCo2Reduced: 0,
        totalEconomicSavings: 0,
        pendingCollections: 0,
        completedCollections: 0,
        totalActivities: 0,
        activeUsersThisMonth: 0
      };
    }
  }

  // Obtener usuarios por ciudad
  async getUsersByCity(): Promise<UsersByCity[]> {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, city')
        .neq('role', 'admin');

      const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected, co2_reduced');

      const cityMap = new Map<string, UsersByCity>();

      profiles?.forEach(profile => {
        const city = profile.city || 'other';
        if (!cityMap.has(city)) {
          cityMap.set(city, { city, userCount: 0, totalWaste: 0, totalCo2: 0 });
        }
        const entry = cityMap.get(city)!;
        entry.userCount++;

        const userStats = stats?.filter(s => s.user_id === profile.id) || [];
        userStats.forEach(s => {
          entry.totalWaste += s.waste_collected || 0;
          entry.totalCo2 += s.co2_reduced || 0;
        });
      });

      return Array.from(cityMap.values()).sort((a, b) => b.totalWaste - a.totalWaste);
    } catch (error) {
      console.error('Error fetching users by city:', error);
      return [];
    }
  }

  // Obtener usuarios por tipo de establecimiento
  async getUsersByType(): Promise<UsersByType[]> {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, type')
        .neq('role', 'admin');

      const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected');

      const typeMap = new Map<string, UsersByType>();

      profiles?.forEach(profile => {
        const type = profile.type || 'other';
        if (!typeMap.has(type)) {
          typeMap.set(type, { type, count: 0, totalWaste: 0 });
        }
        const entry = typeMap.get(type)!;
        entry.count++;

        const userStats = stats?.filter(s => s.user_id === profile.id) || [];
        userStats.forEach(s => {
          entry.totalWaste += s.waste_collected || 0;
        });
      });

      return Array.from(typeMap.values()).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching users by type:', error);
      return [];
    }
  }

  // Obtener actividades recientes globales
  async getRecentActivities(limit: number = 20): Promise<GlobalActivity[]> {
    try {
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('id, user_id, action, amount, type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!activitiesData || activitiesData.length === 0) {
        return [];
      }

      const userIds = [...new Set(activitiesData.map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, establishment')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return activitiesData.map(activity => {
        const profile = profileMap.get(activity.user_id);
        return {
          id: activity.id,
          userName: profile?.name || 'Usuario',
          establishment: profile?.establishment || 'Establecimiento',
          action: activity.action,
          amount: activity.amount || '-',
          type: activity.type,
          status: activity.status,
          createdAt: activity.created_at
        };
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  // Obtener todos los usuarios con estadísticas
  async getAllUsers(): Promise<PlatformUser[]> {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email, establishment, type, city, role, created_at')
        .order('created_at', { ascending: false });

      const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected');

      // Agrupar stats por usuario
      const statsMap = new Map<string, number>();
      stats?.forEach(s => {
        const current = statsMap.get(s.user_id) || 0;
        statsMap.set(s.user_id, current + (s.waste_collected || 0));
      });

      return profiles?.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        establishment: p.establishment,
        type: p.type,
        city: p.city,
        role: p.role || 'user',
        createdAt: p.created_at,
        totalWaste: statsMap.get(p.id) || 0
      })) || [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }

  // Obtener recolecciones recientes
  async getRecentCollections(limit: number = 10): Promise<RecentCollection[]> {
    try {
      const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!collections || collections.length === 0) {
        return [];
      }

      // Obtener información de usuarios
      const userEmails = [...new Set(collections.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email, name, establishment')
        .in('email', userEmails);

      const profileMap = new Map(profiles?.map(p => [p.email, p]) || []);

      return collections.map(c => {
        const profile = profileMap.get(c.user_id);
        return {
          id: c.id,
          userId: c.user_id,
          userName: profile?.name || 'Usuario',
          establishment: profile?.establishment || 'Establecimiento',
          date: c.date,
          time: c.time,
          wasteType: c.waste_type,
          estimatedWeight: c.estimated_weight,
          status: c.status
        };
      });
    } catch (error) {
      console.error('Error fetching recent collections:', error);
      return [];
    }
  }

  // Obtener crecimiento mensual
  async getMonthlyGrowth(): Promise<MonthlyGrowth[]> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Usuarios por mes
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .neq('role', 'admin')
        .gte('created_at', sixMonthsAgo.toISOString());

      // Stats por mes
      const { data: stats } = await supabase
        .from('user_stats')
        .select('month, waste_collected')
        .gte('month', sixMonthsAgo.toISOString().split('T')[0]);

      const monthlyData = new Map<string, MonthlyGrowth>();
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      // Inicializar últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData.set(key, {
          month: monthNames[date.getMonth()],
          newUsers: 0,
          totalWaste: 0
        });
      }

      // Contar usuarios por mes
      profiles?.forEach(p => {
        const date = new Date(p.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData.has(key)) {
          const entry = monthlyData.get(key)!;
          entry.newUsers++;
        }
      });

      // Sumar residuos por mes
      stats?.forEach(s => {
        const date = new Date(s.month);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData.has(key)) {
          const entry = monthlyData.get(key)!;
          entry.totalWaste += s.waste_collected || 0;
        }
      });

      return Array.from(monthlyData.values());
    } catch (error) {
      console.error('Error fetching monthly growth:', error);
      return [];
    }
  }

  // Calcular impacto ambiental global
  async getGlobalEnvironmentalImpact() {
    const stats = await this.getGlobalStats();

    return {
      co2Avoided: Math.round(stats.totalCo2Reduced),
      treesEquivalent: Math.round(stats.totalCo2Reduced / 21),
      bagsAvoided: Math.round(stats.totalWasteCollected / 5),
      waterSaved: Math.round(stats.totalWasteCollected * 10) // ~10 litros por kg
    };
  }
}

// Singleton
let adminModelInstance: AdminDashboardModel | null = null;

export const getAdminDashboardModel = (): AdminDashboardModel => {
  if (!adminModelInstance) {
    adminModelInstance = new AdminDashboardModel();
  }
  return adminModelInstance;
};
