import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  useGlobalStats,
  useUsersByCity,
  useUsersByType,
  useRecentGlobalActivities,
  useAllUsers,
  useRecentCollections
} from '@/hooks/useAdminData';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Users,
  Recycle,
  Leaf,
  TrendingUp,
  Truck,
  Activity,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Shield,
  Globe,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { stats, loading: statsLoading, refetch: refetchStats } = useGlobalStats();
  const { data: usersByCity, loading: cityLoading } = useUsersByCity();
  const { data: usersByType, loading: typeLoading } = useUsersByType();
  const { activities, loading: activitiesLoading } = useRecentGlobalActivities(15);
  const { users, loading: usersLoading } = useAllUsers();
  const { collections, loading: collectionsLoading } = useRecentCollections(10);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statsCards = [
    {
      icon: Users,
      label: 'Usuarios Registrados',
      value: stats.totalUsers.toString(),
      description: 'Total en la plataforma',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      icon: Recycle,
      label: 'Residuos Totales',
      value: `${Math.round(stats.totalWasteCollected).toLocaleString()} kg`,
      description: 'Aprovechados globalmente',
      color: 'from-primary to-accent',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      icon: Leaf,
      label: 'CO₂ Reducido',
      value: `${Math.round(stats.totalCo2Reduced).toLocaleString()} kg`,
      description: 'Emisiones evitadas',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Ahorro Económico',
      value: `$${Math.round(stats.totalEconomicSavings).toLocaleString()}`,
      description: 'COP generados',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500'
    },
    {
      icon: Truck,
      label: 'Recolecciones Pendientes',
      value: stats.pendingCollections.toString(),
      description: 'Por completar',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500'
    },
    {
      icon: Activity,
      label: 'Actividades Totales',
      value: stats.totalActivities.toString(),
      description: 'Registradas en sistema',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-500'
    }
  ];

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'market': 'Plaza de Mercado',
      'hotel': 'Hotel',
      'catering': 'Catering',
      'farm': 'Granja',
      'collection': 'Centro de Acopio',
      'other': 'Otro'
    };
    return types[type] || type;
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
    return cities[city] || city;
  };

  const maxWasteByCity = Math.max(...usersByCity.map(c => c.totalWaste), 1);
  const maxUsersByType = Math.max(...usersByType.map(t => t.count), 1);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Panel de Administración</span>
                </div>
                <h1 className="text-3xl font-bold mb-1">
                  Dashboard <span className="text-gradient">Administrativo</span>
                </h1>
                <p className="text-muted-foreground">
                  Monitoreo en tiempo real de toda la plataforma EcoNariño
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  En tiempo real
                </div>
                <Button
                  variant="outline"
                  onClick={() => refetchStats()}
                  className="hover-lift"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card
                key={index}
                className="p-6 hover-lift shadow-medium border-2 border-transparent hover:border-primary/20 transition-smooth relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  {statsLoading && (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold">{statsLoading ? '...' : stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground/70 mt-1">{stat.description}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Users by City */}
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Usuarios por Ciudad</h2>
                    <p className="text-sm text-muted-foreground">Distribución geográfica</p>
                  </div>
                </div>
              </div>
              {cityLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {usersByCity.slice(0, 6).map((city, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{getCityLabel(city.city)}</span>
                        <span className="text-muted-foreground">
                          {city.userCount} usuarios • {Math.round(city.totalWaste)} kg
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${(city.totalWaste / maxWasteByCity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {usersByCity.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No hay datos disponibles</p>
                  )}
                </div>
              )}
            </Card>

            {/* Users by Type */}
            <Card className="p-6 shadow-medium">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Por Tipo de Establecimiento</h2>
                    <p className="text-sm text-muted-foreground">Clasificación de usuarios</p>
                  </div>
                </div>
              </div>
              {typeLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {usersByType.map((type, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{getTypeLabel(type.type)}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(type.totalWaste)} kg recolectados
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-500">{type.count}</div>
                    </div>
                  ))}
                  {usersByType.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No hay datos disponibles</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="activities" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Actividad Global
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Recolecciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Actividad Reciente Global</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Actualización en tiempo real
                  </div>
                </div>
                {activitiesLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => (
                      <div
                        key={activity.id || index}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth border border-transparent hover:border-primary/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.status === 'completed' ? 'bg-green-500/10' : 'bg-amber-500/10'
                          }`}>
                            {activity.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.userName} • {activity.establishment}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium">{activity.amount}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'completed'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {activity.type}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(activity.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay actividades registradas</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Todos los Usuarios</h2>
                  <span className="text-sm text-muted-foreground">{users.length} registrados</span>
                </div>
                {usersLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Usuario</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Establecimiento</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ciudad</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rol</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Registro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 20).map((user, index) => (
                          <tr key={user.id || index} className="border-b border-border/50 hover:bg-muted/30 transition-smooth">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.establishment}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                {getTypeLabel(user.type)}
                              </span>
                            </td>
                            <td className="py-3 px-4">{getCityLabel(user.city)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-purple-500/10 text-purple-500'
                                  : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString('es-ES')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay usuarios registrados</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="collections">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recolecciones Recientes</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                      {stats.completedCollections} completadas
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500">
                      {stats.pendingCollections} pendientes
                    </span>
                  </div>
                </div>
                {collectionsLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {collections.map((collection, index) => (
                      <Card key={collection.id || index} className="p-4 border-2 border-border hover:border-primary/20 transition-smooth">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            collection.status === 'completed' ? 'bg-green-500/10' : 'bg-amber-500/10'
                          }`}>
                            <Truck className={`w-5 h-5 ${
                              collection.status === 'completed' ? 'text-green-500' : 'text-amber-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{collection.user_id}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(collection.date).toLocaleDateString('es-ES')} • {collection.time}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collection.status === 'completed'
                              ? 'bg-green-500/10 text-green-500'
                              : collection.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {collection.status === 'completed' ? 'Completada' :
                             collection.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="ml-2 font-medium">{collection.waste_type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Peso est.:</span>
                            <span className="ml-2 font-medium">{collection.estimated_weight} kg</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {collections.length === 0 && (
                      <div className="col-span-2 text-center py-12">
                        <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay recolecciones registradas</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Impact Summary */}
          <Card className="p-6 shadow-medium gradient-hero text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Impacto Ambiental Global</h2>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{Math.round(stats.totalWasteCollected).toLocaleString()}</div>
                  <div className="text-sm opacity-80">kg de residuos aprovechados</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{Math.round(stats.totalCo2Reduced).toLocaleString()}</div>
                  <div className="text-sm opacity-80">kg de CO₂ evitados</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{Math.round(stats.totalCo2Reduced / 21)}</div>
                  <div className="text-sm opacity-80">árboles equivalentes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{stats.totalUsers}</div>
                  <div className="text-sm opacity-80">establecimientos comprometidos</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
