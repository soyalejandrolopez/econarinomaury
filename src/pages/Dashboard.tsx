import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import Footer from '@/components/Footer';
import {
  TrendingUp,
  Recycle,
  Leaf,
  Award,
  Download,
  Bell,
  BarChart3,
  Users,
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
  FileText,
  Settings,
  PieChart,
  Activity,
  Zap,
  Star,
  TrendingDown,
  Plus,
  Eye,
  ChevronRight,
  Sparkles,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-primary opacity-20 animate-ping absolute inset-0"></div>
            <Loader2 className="w-20 h-20 animate-spin text-primary relative" />
          </div>
          <p className="text-muted-foreground mt-6 text-lg">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = [
    {
      icon: Recycle,
      label: 'Residuos Aprovechados',
      value: '847',
      unit: 'kg',
      change: '+12%',
      changeType: 'positive',
      color: 'from-primary to-accent',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      progress: 84,
      description: 'Total del mes actual',
    },
    {
      icon: Leaf,
      label: 'Reducción CO₂',
      value: '423',
      unit: 'kg CO₂eq',
      change: '+18%',
      changeType: 'positive',
      color: 'from-secondary to-info',
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
      progress: 92,
      description: 'Emisiones evitadas',
    },
    {
      icon: TrendingUp,
      label: 'Ahorro Económico',
      value: '$320,000',
      unit: 'COP',
      change: '+25%',
      changeType: 'positive',
      color: 'from-accent to-warning',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
      progress: 68,
      description: 'Ahorro estimado',
    },
    {
      icon: Award,
      label: 'Puntos Sostenibilidad',
      value: '1,247',
      unit: 'pts',
      change: '+8%',
      changeType: 'positive',
      color: 'from-success to-secondary',
      bgColor: 'bg-success/10',
      iconColor: 'text-success',
      progress: 75,
      description: 'Ranking: Top 15%',
    },
  ];

  const recentActivity = [
    { date: '13 Nov 2025', action: 'Recolección completada', amount: '45 kg', type: 'Orgánicos', status: 'completed', icon: CheckCircle2 },
    { date: '11 Nov 2025', action: 'Recolección programada', amount: '52 kg', type: 'Compostables', status: 'pending', icon: Clock },
    { date: '09 Nov 2025', action: 'Certificado generado', amount: '-', type: 'ODS 12', status: 'completed', icon: Award },
    { date: '07 Nov 2025', action: 'Recolección completada', amount: '38 kg', type: 'Orgánicos', status: 'completed', icon: CheckCircle2 },
    { date: '05 Nov 2025', action: 'Meta cumplida', amount: '500 kg', type: 'Mensual', status: 'completed', icon: Target },
    { date: '03 Nov 2025', action: 'Recolección completada', amount: '41 kg', type: 'Orgánicos', status: 'completed', icon: CheckCircle2 },
  ];

  const monthlyData = [
    { month: 'Jun', value: 520, trend: 'up' },
    { month: 'Jul', value: 580, trend: 'up' },
    { month: 'Ago', value: 650, trend: 'up' },
    { month: 'Sep', value: 720, trend: 'up' },
    { month: 'Oct', value: 790, trend: 'up' },
    { month: 'Nov', value: 847, trend: 'up' },
  ];

  const wasteByType = [
    { type: 'Orgánicos', value: 45, color: 'bg-primary' },
    { type: 'Compostables', value: 30, color: 'bg-secondary' },
    { type: 'Reciclables', value: 15, color: 'bg-accent' },
    { type: 'Otros', value: 10, color: 'bg-muted' },
  ];

  const upcomingCollections = [
    { date: '15 Nov', time: '08:00 AM', type: 'Orgánicos', weight: '~50 kg' },
    { date: '18 Nov', time: '09:30 AM', type: 'Compostables', weight: '~35 kg' },
    { date: '22 Nov', time: '08:00 AM', type: 'Orgánicos', weight: '~45 kg' },
  ];

  const achievements = [
    { icon: Star, title: 'Primera Semana', description: 'Completaste tu primera semana activa', unlocked: true },
    { icon: Award, title: 'Eco Warrior', description: '100 kg de residuos aprovechados', unlocked: true },
    { icon: Target, title: 'Meta Cumplida', description: 'Alcanzaste tu primera meta mensual', unlocked: true },
    { icon: Zap, title: 'Súper Activo', description: '10 recolecciones programadas', unlocked: false },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'market': 'Plaza de Mercado',
      'hotel': 'Hotel',
      'farm': 'Granja',
      'collection': 'Centro de Acopio'
    };
    return types[type] || 'Establecimiento';
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-6 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{greeting},</span>
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
                  <span>{user.city}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 shadow-medium">
                  <Building2 className="w-4 h-4" />
                  {getTypeLabel(user.type)}
                </span>
                <span className="px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-2 border border-success/20">
                  <Award className="w-4 h-4" />
                  Certificado ODS
                </span>
                <span className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium flex items-center gap-2 border border-accent/20">
                  <Star className="w-4 h-4" />
                  Top 15%
                </span>
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
                      15 Nov 2025 - 08:00 AM
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
            {stats.map((stat, index) => (
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

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full gradient-primary"></div>
                    <span className="text-muted-foreground">Kg aprovechados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">+63% vs año anterior</span>
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
                      <p className="text-xs text-muted-foreground">Noviembre 2025</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso actual</span>
                      <span className="font-bold text-accent">847 / 1,000 kg</span>
                    </div>
                    <Progress value={84.7} className="h-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Faltan 153 kg</span>
                    <span className="text-success font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      En camino
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
                  {recentActivity.map((activity, index) => (
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
                  {upcomingCollections.map((collection, index) => (
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
                          <div className="text-3xl font-bold text-gradient">847</div>
                          <div className="text-sm text-muted-foreground">kg totales</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Logros Desbloqueados</h2>
                  <div className="text-sm text-muted-foreground">
                    3 de 4 completados
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className={`p-5 text-center border-2 transition-smooth ${
                        achievement.unlocked
                          ? 'border-accent/30 bg-accent/5'
                          : 'border-border opacity-50'
                      }`}
                    >
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        achievement.unlocked ? 'gradient-warm' : 'bg-muted'
                      }`}>
                        <achievement.icon className={`w-7 h-7 ${
                          achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h3 className="font-bold mb-1">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-accent font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Desbloqueado
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
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
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-success/5">
                  <span className="text-sm">CO₂ evitado</span>
                  <span className="font-bold text-success">423 kg</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5">
                  <span className="text-sm">Árboles equivalentes</span>
                  <span className="font-bold text-secondary">12</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="text-sm">Bolsas de basura evitadas</span>
                  <span className="font-bold text-primary">169</span>
                </div>
              </div>
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
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth group">
                  <span className="text-sm">Soporte</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                </a>
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
      </div>
    </div>
  );
};

export default Dashboard;
