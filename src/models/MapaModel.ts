import { supabase } from '@/lib/supabase';

// Interfaces
export interface Municipio {
  id: string;
  name: string;
  userCount: number;
  totalWaste: number;
  collectionPoints: number;
  status: 'active' | 'coming_soon';
  nextCollection: string | null;
}

export interface PuntoAcopio {
  id: string;
  name: string;
  type: 'acopio' | 'transformacion' | 'destino_final';
  address: string;
  capacity: string;
  status: 'active' | 'inactive';
  city: string;
}

export interface RutaRecoleccion {
  id: string;
  name: string;
  code: string;
  city: string;
  stops: number;
  status: 'in_progress' | 'scheduled' | 'completed';
  progress: number;
  date: string;
}

export interface EstadisticasMapa {
  municipiosActivos: number;
  puntosRecoleccion: number;
  vehiculosEnRuta: number;
  totalWasteCollected: number;
  totalUsers: number;
}

// Modelo
export class MapaModel {
  // Obtener estadísticas generales del mapa
  async getEstadisticas(): Promise<EstadisticasMapa> {
    try {
      // Contar usuarios por ciudad (municipios activos)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('city')
        .not('city', 'is', null);

      const uniqueCities = new Set(profiles?.map(p => p.city).filter(Boolean));

      // Contar usuarios totales
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Obtener total de residuos recolectados
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('waste_collected');

      const totalWaste = statsData?.reduce((acc, curr) => acc + (curr.waste_collected || 0), 0) || 0;

      // Contar recolecciones pendientes hoy (vehículos en ruta)
      const today = new Date().toISOString().split('T')[0];
      const { count: vehiculosEnRuta } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'pending');

      return {
        municipiosActivos: uniqueCities.size,
        puntosRecoleccion: uniqueCities.size * 2, // Estimado basado en ciudades
        vehiculosEnRuta: vehiculosEnRuta || 0,
        totalWasteCollected: totalWaste,
        totalUsers: totalUsers || 0
      };
    } catch (error) {
      console.error('Error getting map statistics:', error);
      return {
        municipiosActivos: 0,
        puntosRecoleccion: 0,
        vehiculosEnRuta: 0,
        totalWasteCollected: 0,
        totalUsers: 0
      };
    }
  }

  // Obtener municipios con datos reales
  async getMunicipios(): Promise<Municipio[]> {
    try {
      // Obtener usuarios agrupados por ciudad
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, city, establishment_type');

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Obtener estadísticas de residuos por usuario
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('user_id, waste_collected');

      // Crear mapa de residuos por usuario
      const wasteByUser = new Map<string, number>();
      userStats?.forEach(stat => {
        const current = wasteByUser.get(stat.user_id) || 0;
        wasteByUser.set(stat.user_id, current + (stat.waste_collected || 0));
      });

      // Obtener próximas recolecciones por ciudad
      const today = new Date().toISOString().split('T')[0];
      const { data: nextCollections } = await supabase
        .from('collections')
        .select('user_id, date, time')
        .eq('status', 'pending')
        .gte('date', today)
        .order('date', { ascending: true });

      // Agrupar datos por ciudad
      const cityData = new Map<string, {
        userCount: number;
        totalWaste: number;
        userIds: string[];
      }>();

      profiles.forEach(profile => {
        const city = profile.city || 'other';
        const current = cityData.get(city) || { userCount: 0, totalWaste: 0, userIds: [] };
        current.userCount++;
        current.totalWaste += wasteByUser.get(profile.id) || 0;
        current.userIds.push(profile.id);
        cityData.set(city, current);
      });

      // Crear mapa de próxima recolección por usuario
      const nextCollectionByUser = new Map<string, { date: string; time: string }>();
      nextCollections?.forEach(col => {
        if (!nextCollectionByUser.has(col.user_id)) {
          nextCollectionByUser.set(col.user_id, { date: col.date, time: col.time });
        }
      });

      // Convertir a array de municipios
      const cityLabels: { [key: string]: string } = {
        'pasto': 'Pasto',
        'ipiales': 'Ipiales',
        'tumaco': 'Tumaco',
        'tuquerres': 'Túquerres',
        'sandona': 'Sandoná',
        'la_union': 'La Unión',
        'samaniego': 'Samaniego',
        'other': 'Otros'
      };

      const municipios: Municipio[] = [];

      cityData.forEach((data, cityKey) => {
        // Encontrar próxima recolección para esta ciudad
        let nextCollection: string | null = null;
        for (const userId of data.userIds) {
          const collection = nextCollectionByUser.get(userId);
          if (collection) {
            const date = new Date(collection.date);
            nextCollection = `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} ${collection.time}`;
            break;
          }
        }

        municipios.push({
          id: cityKey,
          name: cityLabels[cityKey.toLowerCase()] || cityKey,
          userCount: data.userCount,
          totalWaste: data.totalWaste,
          collectionPoints: Math.max(1, Math.floor(data.userCount / 10)),
          status: data.userCount > 0 ? 'active' : 'coming_soon',
          nextCollection
        });
      });

      // Ordenar por cantidad de usuarios
      return municipios.sort((a, b) => b.userCount - a.userCount);
    } catch (error) {
      console.error('Error getting municipalities:', error);
      return [];
    }
  }

  // Obtener puntos de acopio (basado en centros de tipo 'collection')
  async getPuntosAcopio(): Promise<PuntoAcopio[]> {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, establishment, establishment_type, city, address')
        .eq('establishment_type', 'collection');

      if (!profiles || profiles.length === 0) {
        // Retornar puntos base si no hay centros registrados
        return this.getDefaultPuntosAcopio();
      }

      return profiles.map(p => ({
        id: p.id,
        name: p.establishment || 'Centro de Acopio',
        type: 'acopio' as const,
        address: p.address || 'Dirección no especificada',
        capacity: '500 kg/día',
        status: 'active' as const,
        city: p.city || 'pasto'
      }));
    } catch (error) {
      console.error('Error getting collection points:', error);
      return this.getDefaultPuntosAcopio();
    }
  }

  private getDefaultPuntosAcopio(): PuntoAcopio[] {
    return [
      {
        id: 'default-1',
        name: 'Centro de Acopio Principal',
        type: 'acopio',
        address: 'Pasto, Nariño',
        capacity: '500 kg/día',
        status: 'active',
        city: 'pasto'
      },
      {
        id: 'default-2',
        name: 'Planta de Compostaje EcoNariño',
        type: 'transformacion',
        address: 'Vía Pasto-Chachagüí',
        capacity: '2,000 kg/día',
        status: 'active',
        city: 'pasto'
      }
    ];
  }

  // Obtener rutas de recolección (basado en recolecciones programadas)
  async getRutas(): Promise<RutaRecoleccion[]> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Obtener recolecciones del día
      const { data: collections } = await supabase
        .from('collections')
        .select(`
          id,
          date,
          time,
          status,
          user_id,
          profiles:user_id (city)
        `)
        .eq('date', today)
        .order('time', { ascending: true });

      if (!collections || collections.length === 0) {
        return [];
      }

      // Agrupar por ciudad para crear rutas
      const routesByCity = new Map<string, {
        total: number;
        completed: number;
        pending: number;
      }>();

      collections.forEach(col => {
        const city = (col.profiles as any)?.city || 'pasto';
        const current = routesByCity.get(city) || { total: 0, completed: 0, pending: 0 };
        current.total++;
        if (col.status === 'completed') {
          current.completed++;
        } else {
          current.pending++;
        }
        routesByCity.set(city, current);
      });

      const cityLabels: { [key: string]: string } = {
        'pasto': 'Pasto',
        'ipiales': 'Ipiales',
        'tumaco': 'Tumaco',
        'tuquerres': 'Túquerres'
      };

      const rutas: RutaRecoleccion[] = [];
      let routeIndex = 1;

      routesByCity.forEach((data, city) => {
        const progress = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        let status: 'in_progress' | 'scheduled' | 'completed' = 'scheduled';

        if (progress === 100) {
          status = 'completed';
        } else if (progress > 0) {
          status = 'in_progress';
        }

        rutas.push({
          id: `route-${city}`,
          name: `Ruta ${cityLabels[city] || city}`,
          code: `R${String(routeIndex).padStart(3, '0')}`,
          city: cityLabels[city] || city,
          stops: data.total,
          status,
          progress,
          date: today
        });
        routeIndex++;
      });

      return rutas;
    } catch (error) {
      console.error('Error getting routes:', error);
      return [];
    }
  }
}

// Singleton
let mapaModelInstance: MapaModel | null = null;

export const getMapaModel = (): MapaModel => {
  if (!mapaModelInstance) {
    mapaModelInstance = new MapaModel();
  }
  return mapaModelInstance;
};
