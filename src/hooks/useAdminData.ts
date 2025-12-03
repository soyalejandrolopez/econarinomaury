import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalStats {
  totalUsers: number;
  totalWasteCollected: number;
  totalCo2Reduced: number;
  totalEconomicSavings: number;
  pendingCollections: number;
  completedCollections: number;
  totalActivities: number;
}

interface UserByCity {
  city: string;
  userCount: number;
  totalWaste: number;
  totalCo2: number;
}

interface UserByType {
  type: string;
  count: number;
  totalWaste: number;
}

interface RecentActivity {
  id: string;
  userName: string;
  establishment: string;
  action: string;
  amount: string;
  type: string;
  status: string;
  createdAt: string;
}

interface NewUsersByMonth {
  month: string;
  count: number;
}

interface AllUser {
  id: string;
  name: string;
  email: string;
  establishment: string;
  type: string;
  city: string;
  role: string;
  createdAt: string;
}

export const useGlobalStats = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalWasteCollected: 0,
    totalCo2Reduced: 0,
    totalEconomicSavings: 0,
    pendingCollections: 0,
    completedCollections: 0,
    totalActivities: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      // Obtener total de usuarios
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'admin');

      // Obtener estadísticas agregadas
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('waste_collected, co2_reduced, economic_savings');

      const totals = statsData?.reduce((acc, curr) => ({
        waste: acc.waste + (curr.waste_collected || 0),
        co2: acc.co2 + (curr.co2_reduced || 0),
        savings: acc.savings + (curr.economic_savings || 0)
      }), { waste: 0, co2: 0, savings: 0 }) || { waste: 0, co2: 0, savings: 0 };

      // Obtener recolecciones pendientes y completadas
      const { count: pendingCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: completedCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Obtener total de actividades
      const { count: activityCount } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalWasteCollected: totals.waste,
        totalCo2Reduced: totals.co2,
        totalEconomicSavings: totals.savings,
        pendingCollections: pendingCount || 0,
        completedCollections: completedCount || 0,
        totalActivities: activityCount || 0
      });
    } catch (error) {
      console.error('Error fetching global stats:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchStats();

    // Suscribirse a cambios en tiempo real
    const channels = [
      supabase
        .channel('profiles-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
        .subscribe(),
      supabase
        .channel('user_stats-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, fetchStats)
        .subscribe(),
      supabase
        .channel('collections-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, fetchStats)
        .subscribe(),
      supabase
        .channel('activities-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchStats)
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};

export const useUsersByCity = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<UserByCity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, city')
        .neq('role', 'admin');

      const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected, co2_reduced');

      const cityMap = new Map<string, UserByCity>();

      profiles?.forEach(profile => {
        const city = profile.city || 'Otro';
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

      setData(Array.from(cityMap.values()).sort((a, b) => b.totalWaste - a.totalWaste));
    } catch (error) {
      console.error('Error fetching users by city:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('profiles-city-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};

export const useUsersByType = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<UserByType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, type')
        .neq('role', 'admin');

      const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected');

      const typeMap = new Map<string, UserByType>();

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

      setData(Array.from(typeMap.values()).sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching users by type:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('profiles-type-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};

export const useRecentGlobalActivities = (limit: number = 20) => {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data: activitiesData } = await supabase
        .from('activities')
        .select('id, user_id, action, amount, type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!activitiesData) {
        setActivities([]);
        return;
      }

      const userIds = [...new Set(activitiesData.map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, establishment')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedActivities: RecentActivity[] = activitiesData.map(activity => {
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

      setActivities(enrichedActivities);
    } catch (error) {
      console.error('Error fetching global activities:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, limit]);

  useEffect(() => {
    fetchActivities();

    const channel = supabase
      .channel('activities-global-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchActivities)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchActivities]);

  return { activities, loading, refetch: fetchActivities };
};

export const useAllUsers = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<AllUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, email, establishment, type, city, role, created_at')
        .order('created_at', { ascending: false });

      setUsers(data?.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        establishment: u.establishment,
        type: u.type,
        city: u.city,
        role: u.role || 'user',
        createdAt: u.created_at
      })) || []);
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('profiles-all-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
};

export const useRecentCollections = (limit: number = 10) => {
  const { isAdmin } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, limit]);

  useEffect(() => {
    fetchCollections();

    const channel = supabase
      .channel('collections-recent-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, fetchCollections)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCollections]);

  return { collections, loading, refetch: fetchCollections };
};
