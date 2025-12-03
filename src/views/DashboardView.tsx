import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserActivities, useUserCollections } from '@/hooks/useUserData';
import { useDashboardController } from '@/controllers/DashboardController';
import {
  TrendingUp,
  Recycle,
  Leaf,
  Award,
  Download,
  Bell,
  BarChart3,
  Calendar,
  Target,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  Truck,
  PieChart,
  Activity,
  Zap,
  Star,
  TrendingDown,
  Plus,
  Eye,
  ChevronRight,
  Sparkles,
  Globe,
  Users
} from 'lucide-react';

// Mapa de iconos para logros
const achievementIcons: { [key: string]: any } = {
  'Star': Star,
  'Award': Award,
  'Target': Target,
  'Zap': Zap,
  'Leaf': Leaf,
  'Users': Users
};

interface DashboardViewProps {
  user: {
    name: string;
    email: string;
    establishment: string;
    type: string;
    city: string;
  };
  session: any;
}

const DashboardView = ({ user, session }: DashboardViewProps) => {
  const navigate = useNavigate();
  const { activities, loading: activitiesLoading } = useUserActivities();
  const { collections, loading: collectionsLoading } = useUserCollections();

  // Usar el controlador
  const {
    state,
    getGreeting,
    formatNextCollectionDate,
    getGoalProgress,
    getGoalRemaining,
    getUnlockedAchievementsCount,
    getTotalWaste
  } = useDashboardController(session?.user?.id);

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
    return types[type] || 'Establecimiento';
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
    return cities[city?.toLowerCase()] || city;
  };

  // Construir datos de estadísticas desde el controlador
  const statsData = [
    {
      icon: Recycle,
      label: 'Residuos Aprovechados',
      value: state.loading.stats ? '...' : Math.round(state.stats.wasteCollected).toString(),
      unit: 'kg',
      change: state.monthlyChange.waste >= 0 ? `+${state.monthlyChange.waste}%` : `${state.monthlyChange.waste}%`,
      changeType: state.monthlyChange.waste >= 0 ? 'positive' : 'negative',
      color: 'from-primary to-accent',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      progress: Math.min((state.stats.wasteCollected / 1000) * 100, 100),
      description: 'Total acumulado',
    },
    {
      icon: Leaf,
      label: 'Reducción CO₂',
      value: state.loading.stats ? '...' : Math.round(state.stats.co2Reduced).toString(),
      unit: 'kg CO₂eq',
      change: state.monthlyChange.co2 >= 0 ? `+${state.monthlyChange.co2}%` : `${state.monthlyChange.co2}%`,
      changeType: state.monthlyChange.co2 >= 0 ? 'positive' : 'negative',
      color: 'from-secondary to-info',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      progress: Math.min((state.stats.co2Reduced / 500) * 100, 100),
      description: 'Emisiones evitadas',
    },
    {
      icon: TrendingUp,
      label: 'Ahorro Económico',
      value: state.loading.stats ? '...' : `$${Math.round(state.stats.economicSavings).toLocaleString()}`,
      unit: 'COP',
      change: state.monthlyChange.savings >= 0 ? `+${state.monthlyChange.savings}%` : `${state.monthlyChange.savings}%`,
      changeType: state.monthlyChange.savings >= 0 ? 'positive' : 'negative',
      color: 'from-accent to-warning',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      progress: Math.min((state.stats.economicSavings / 400000) * 100, 100),
      description: 'Ahorro estimado',
    },
    {
      icon: Award,
      label: 'Puntos Sostenibilidad',
      value: state.loading.stats ? '...' : state.stats.sustainabilityPoints.toLocaleString(),
      unit: 'pts',
      change: '+0%',
      changeType: 'positive',
      color: 'from-success to-secondary',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      progress: Math.min((state.stats.sustainabilityPoints / 1500) * 100, 100),
      description: 'Puntos acumulados',
    },
  ];

  // Mapear actividades
  const recentActivity = activitiesLoading ? [] : activities.map(act => ({
    date: new Date(act.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    action: act.action,
    amount: act.amount || '-',
    type: act.type,
    status: act.status,
    icon: act.status === 'completed' ? CheckCircle2 : Clock
  }));

  const displayActivities = recentActivity.length > 0 ? recentActivity : [
    { date: 'Sin datos', action: 'Aún no tienes actividad registrada', amount: '-', type: 'Comienza programando una recolección', status: 'pending', icon: AlertCircle },
  ];

  // Mapear recolecciones
  const upcomingCollections = collectionsLoading ? [] : collections
    .filter(c => c.status === 'pending' && new Date(c.date) >= new Date())
    .slice(0, 3)
    .map(c => ({
      date: new Date(c.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      time: c.time,
      type: c.waste_type,
      weight: `~${c.estimated_weight} kg`
    }));

  const displayCollections = upcomingCollections.length > 0 ? upcomingCollections : [
    { date: 'Sin programar', time: '--:--', type: 'No hay recolecciones programadas', weight: '-- kg' },
  ];

  // Datos de gráfico mensual
  const monthlyData = state.monthlyData.length > 0 ? state.monthlyData : [];
  const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.value), 1) : 1;

  // Datos de residuos por tipo
  const wasteByType = state.wasteByType.length > 0 ? state.wasteByType : [];

  // Logros
  const achievements = state.achievements;
  const achievementCounts = getUnlockedAchievementsCount();

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-6 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">{getGreeting()},</span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-gradient">{user.name}</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="truncate max-w-xs">{user.establishment}</span>
              <span className="text-border">•</span>
              <MapPin className="w-4 h-4" />
              <span>{getCityLabel(user.city)}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-medium">
              <Building2 className="w-4 h-4" />
              {getTypeLabel(user.type)}
            </span>
            {state.stats.wasteCollected >= 50 && (
              <span className="px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-2 border border-success/20">
                <Award className="w-4 h-4" />
                Certificado ODS
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Bar */}
        <Card className="p-4 bg-card border-2 border-primary/10 shadow-medium">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-medium">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Próxima recolección</div>
                <div className="font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {state.loading.nextCollection ? 'Cargando...' : formatNextCollectionDate()}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate('/programar-recoleccion')} className="gradient-primary hover-lift shadow-glow">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Recolección
              </Button>
              <Button onClick={() => navigate('/certificado')} variant="outline" className="hover-lift border-2">
                <Download className="w-4 h-4 mr-2" />
                Certificado
              </Button>
              <Button onClick={() => navigate('/reportes')} variant="outline" className="hover-lift border-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reportes
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover-lift shadow-medium border-2 border-transparent hover:border-primary/20 transition-smooth relative overflow-hidden group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`}></div>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.changeType === 'positive'
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {stat.changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.unit}</div>
            </div>
            <Progress value={stat.progress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-medium">{stat.description}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 shadow-medium border-2 border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Residuos Aprovechados</h2>
              <p className="text-sm text-muted-foreground">Evolución de los últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hover-lift">
                <Calendar className="w-4 h-4 mr-2" />
                Este Año
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {state.loading.monthly ? (
            <div className="h-72 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : monthlyData.length > 0 ? (
            <div className="h-72 flex items-end justify-between gap-3 mt-8 px-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full flex items-end justify-center mb-3 h-52 relative">
                    <div
                      className="w-full gradient-primary rounded-t-lg transition-all duration-500 group-hover:opacity-90 relative"
                      style={{ height: `${(item.value / maxValue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card px-2 py-1 rounded-lg shadow-medium opacity-0 group-hover:opacity-100 transition-smooth text-sm font-bold whitespace-nowrap border border-border">
                        {item.value} kg
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{item.month}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aún no hay datos mensuales</p>
                <p className="text-sm">Programa tu primera recolección para comenzar</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full gradient-primary"></div>
                <span className="text-muted-foreground">Kg aprovechados</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/reportes')}>
              Ver detalles <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 shadow-medium border-2 border-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Button onClick={() => navigate('/programar-recoleccion')} className="w-full gradient-primary hover-lift justify-start" size="lg">
                <Bell className="w-5 h-5 mr-3" />
                Programar Recolección
              </Button>
              <Button onClick={() => navigate('/certificado')} variant="outline" className="w-full hover-lift justify-start border-2" size="lg">
                <Download className="w-5 h-5 mr-3" />
                Descargar Certificado
              </Button>
              <Button onClick={() => navigate('/reportes')} variant="outline" className="w-full hover-lift justify-start border-2" size="lg">
                <BarChart3 className="w-5 h-5 mr-3" />
                Ver Reportes
              </Button>
              <Button onClick={() => navigate('/metas')} variant="outline" className="w-full hover-lift justify-start border-2" size="lg">
                <Target className="w-5 h-5 mr-3" />
                Mis Metas
              </Button>
            </div>
          </Card>

          {/* Monthly Goal Progress */}
          <Card className="p-6 shadow-medium border-2 border-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 gradient-warm opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-medium">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">Meta del Mes</h3>
                  <p className="text-xs text-muted-foreground">
                    {state.currentGoal ? `${state.currentGoal.month} ${state.currentGoal.year}` : 'Cargando...'}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progreso actual</span>
                  <span className="font-bold text-accent">
                    {state.loading.goal ? '...' : `${Math.round(state.currentGoal?.currentAmount || 0)} / ${state.currentGoal?.targetAmount || 100} kg`}
                  </span>
                </div>
                <Progress value={getGoalProgress()} className="h-3" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {getGoalRemaining() > 0 ? `Faltan ${Math.round(getGoalRemaining())} kg` : '¡Meta alcanzada!'}
                </span>
                <span className={`font-medium flex items-center gap-1 ${getGoalProgress() >= 100 ? 'text-success' : 'text-warning'}`}>
                  {getGoalProgress() >= 100 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Completado
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      En progreso
                    </>
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="activity" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Actividad
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Recolecciones
          </TabsTrigger>
          <TabsTrigger value="waste" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Residuos
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Logros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Actividad Reciente</h2>
              <Button variant="ghost" size="sm">Ver Todo <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <div className="space-y-4">
              {displayActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth border border-transparent hover:border-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-success/10' : 'bg-warning/10'
                    }`}>
                      <activity.icon className={`w-5 h-5 ${
                        activity.status === 'completed' ? 'text-success' : 'text-warning'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{activity.amount}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Próximas Recolecciones</h2>
              <Button onClick={() => navigate('/programar-recoleccion')} className="gradient-primary hover-lift">
                <Plus className="w-4 h-4 mr-2" />
                Programar Nueva
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {displayCollections.map((collection, index) => (
                <Card key={index} className="p-5 border-2 border-primary/10 hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Truck className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-bold">{collection.date}</div>
                      <div className="text-sm text-muted-foreground">{collection.time}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium">{collection.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimado</span>
                      <span className="font-medium">{collection.weight}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="waste">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Distribución de Residuos</h2>
              <Button variant="outline" onClick={() => navigate('/reportes')}>
                Ver Detalles <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {state.loading.waste ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : wasteByType.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {wasteByType.map((waste, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{waste.type}</span>
                        <span className="text-muted-foreground">{waste.value}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${waste.color} rounded-full transition-all duration-500`}
                          style={{ width: `${waste.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full gradient-hero opacity-20"></div>
                    <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gradient">{getTotalWaste()}</div>
                        <div className="text-sm text-muted-foreground">kg totales</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aún no hay datos de residuos</p>
                <p className="text-sm">Los datos aparecerán cuando completes recolecciones</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Logros</h2>
              <div className="text-sm text-muted-foreground">
                {achievementCounts.unlocked} de {achievementCounts.total} desbloqueados
              </div>
            </div>
            {state.loading.achievements ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievementIcons[achievement.icon] || Star;
                  return (
                    <Card
                      key={achievement.id || index}
                      className={`p-5 text-center border-2 transition-smooth ${
                        achievement.unlocked
                          ? 'border-accent/30 bg-accent/5'
                          : 'border-border opacity-50'
                      }`}
                    >
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        achievement.unlocked ? 'gradient-warm' : 'bg-muted'
                      }`}>
                        <IconComponent className={`w-7 h-7 ${
                          achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h3 className="font-bold mb-1 text-sm">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-accent font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Desbloqueado
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Environmental Impact */}
        <Card className="p-6 shadow-medium border-2 border-success/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-bold">Impacto Ambiental</h3>
              <p className="text-xs text-muted-foreground">Tu contribución al planeta</p>
            </div>
          </div>
          {state.loading.impact ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-success/5">
                <span className="text-sm">CO₂ evitado</span>
                <span className="font-bold text-success">{state.environmentalImpact.co2Avoided} kg</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5">
                <span className="text-sm">Árboles equivalentes</span>
                <span className="font-bold text-secondary">{state.environmentalImpact.treesEquivalent}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                <span className="text-sm">Bolsas de basura evitadas</span>
                <span className="font-bold text-primary">{state.environmentalImpact.bagsAvoided}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <Card className="p-6 shadow-medium">
          <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
          <div className="space-y-2">
            <Link to="/como-funciona" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth group">
              <span className="text-sm">¿Cómo funciona?</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </Link>
            <Link to="/beneficios" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth group">
              <span className="text-sm">Beneficios</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </Link>
            <Link to="/impacto" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth group">
              <span className="text-sm">Impacto Regional</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </Link>
            <Link to="/trazabilidad" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth group">
              <span className="text-sm">Trazabilidad</span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
            </Link>
          </div>
        </Card>

        {/* Tip of the Day */}
        <Card className="p-6 shadow-medium gradient-cool text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Consejo del día</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Separa correctamente</h3>
            <p className="text-sm opacity-90 mb-4">
              Recuerda separar los residuos orgánicos de los reciclables para maximizar el aprovechamiento y obtener más puntos de sostenibilidad.
            </p>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">
              Más consejos <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
