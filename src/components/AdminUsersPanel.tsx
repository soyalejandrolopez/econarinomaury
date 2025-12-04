import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Search,
  Loader2,
  Building2,
  MapPin,
  Mail,
  Calendar,
  RefreshCw,
  Shield,
  User as UserIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  establishment: string;
  type: string;
  city: string;
  role: string;
  created_at: string;
}

interface UserStats {
  user_id: string;
  total_collections: number;
  total_weight: number;
}

const AdminUsersPanel = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userStats, setUserStats] = useState<Map<string, UserStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'created_at' | 'establishment'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expanded, setExpanded] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Cargar todos los perfiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (profilesError) throw profilesError;

      setUsers(profiles || []);

      // Cargar estadísticas de recolecciones por usuario
      const { data: collections, error: collectionsError } = await supabase
        .from('collections')
        .select('user_id, estimated_weight');

      if (!collectionsError && collections) {
        const statsMap = new Map<string, UserStats>();
        collections.forEach(col => {
          const existing = statsMap.get(col.user_id);
          if (existing) {
            existing.total_collections += 1;
            existing.total_weight += Number(col.estimated_weight) || 0;
          } else {
            statsMap.set(col.user_id, {
              user_id: col.user_id,
              total_collections: 1,
              total_weight: Number(col.estimated_weight) || 0
            });
          }
        });
        setUserStats(statsMap);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [sortField, sortDirection]);

  const handleSort = (field: 'name' | 'created_at' | 'establishment') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'market': 'Plaza de Mercado',
      'hotel': 'Hotel',
      'farm': 'Granja',
      'collection': 'Centro de Acopio',
      'catering': 'Catering',
      'other': 'Otro'
    };
    return types[type] || type || 'No especificado';
  };

  const getCityLabel = (city: string) => {
    const cities: { [key: string]: string } = {
      'pasto': 'Pasto',
      'ipiales': 'Ipiales',
      'tumaco': 'Tumaco',
      'tuquerres': 'Túquerres',
      'sandona': 'Sandoná',
      'la_union': 'La Unión',
      'samaniego': 'Samaniego',
      'other': 'Otro'
    };
    return cities[city?.toLowerCase()] || city || 'No especificado';
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.establishment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="w-4 h-4" /> :
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <Card className="p-6 shadow-medium border-2 border-primary/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Panel de Administrador
            </h2>
            <p className="text-sm text-muted-foreground">
              {users.length} usuarios registrados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {expanded && (
        <>
          {/* Barra de búsqueda */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email, establecimiento o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabla de usuarios */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th
                      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Usuario
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('establishment')}
                    >
                      <div className="flex items-center gap-1">
                        Establecimiento
                        <SortIcon field="establishment" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ciudad</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Recolecciones</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Kg Total</th>
                    <th
                      className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        Registro
                        <SortIcon field="created_at" />
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const stats = userStats.get(user.id);
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name || 'Sin nombre'}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{user.establishment || 'No especificado'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {getCityLabel(user.city)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                            {getTypeLabel(user.type)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-medium">{stats?.total_collections || 0}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-medium text-primary">
                            {Math.round(stats?.total_weight || 0)} kg
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {user.created_at ?
                              new Date(user.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }) :
                              'Sin fecha'
                            }
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'Usuario'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Resumen */}
          {!loading && filteredUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Usuarios</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-secondary">
                  {Array.from(userStats.values()).reduce((sum, s) => sum + s.total_collections, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Recolecciones</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(Array.from(userStats.values()).reduce((sum, s) => sum + s.total_weight, 0))} kg
                </div>
                <div className="text-sm text-muted-foreground">Kg Totales</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-success">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Administradores</div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AdminUsersPanel;
