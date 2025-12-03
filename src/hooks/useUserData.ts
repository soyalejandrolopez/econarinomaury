import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { dataCache } from '@/lib/cache';

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    wasteCollected: 0,
    co2Reduced: 0,
    economicSavings: 0,
    sustainabilityPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;

      // Verificar caché primero (opcional)
      const cacheKey = `stats_${user.email}`;
      try {
        const cached = dataCache.get(cacheKey);
        if (cached) {
          setStats(cached);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Cache error, fetching fresh data:', err);
      }

      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.email)
          .gte('month', new Date(new Date().getFullYear(), 0, 1).toISOString())
          .order('month', { ascending: false });

        if (!error && data) {
          const totals = data.reduce((acc, curr) => ({
            wasteCollected: acc.wasteCollected + (Number(curr.waste_collected) || 0),
            co2Reduced: acc.co2Reduced + (Number(curr.co2_reduced) || 0),
            economicSavings: acc.economicSavings + (Number(curr.economic_savings) || 0),
            sustainabilityPoints: acc.sustainabilityPoints + (Number(curr.sustainability_points) || 0)
          }), { wasteCollected: 0, co2Reduced: 0, economicSavings: 0, sustainabilityPoints: 0 });

          setStats(totals);
          dataCache.set(cacheKey, totals);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};

export const useUserActivities = (limit = 6) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.email) return;

      const cacheKey = `activities_${user.email}_${limit}`;
      const cached = dataCache.get(cacheKey);
      
      if (cached) {
        setActivities(cached);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.email)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!error && data) {
          setActivities(data);
          dataCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, limit]);

  return { activities, loading };
};

export const useUserCollections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!user?.email) return;

      const cacheKey = `collections_${user.email}`;
      const cached = dataCache.get(cacheKey);
      
      if (cached) {
        setCollections(cached);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', user.email)
          .order('date', { ascending: true });

        if (!error && data) {
          setCollections(data);
          dataCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user]);

  return { collections, loading };
};

export const useUserGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.email) return;

      const cacheKey = `goals_${user.email}`;
      const cached = dataCache.get(cacheKey);
      
      if (cached) {
        setGoals(cached);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.email)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setGoals(data);
          dataCache.set(cacheKey, data);
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  return { goals, loading, setGoals };
};
