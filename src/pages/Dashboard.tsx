import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
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
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostrar loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el useEffect redirigirá)
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
      color: 'bg-primary/10 text-primary',
      progress: 84,
    },
    {
      icon: Leaf,
      label: 'Reducción CO₂',
      value: '423',
      unit: 'kg CO₂eq',
      change: '+18%',
      color: 'bg-secondary/10 text-secondary',
      progress: 92,
    },
    {
      icon: TrendingUp,
      label: 'Ahorro Económico',
      value: '$320,000',
      unit: 'COP',
      change: '+25%',
      color: 'bg-accent/10 text-accent',
      progress: 68,
    },
    {
      icon: Award,
      label: 'Puntos Sostenibilidad',
      value: '1,247',
      unit: 'pts',
      change: '+8%',
      color: 'bg-success/10 text-success',
      progress: 75,
    },
  ];

  const recentActivity = [
    { date: '13 Nov 2025', action: 'Recolección programada', amount: '45 kg', type: 'Orgánicos', status: 'Completado' },
    { date: '11 Nov 2025', action: 'Recolección programada', amount: '52 kg', type: 'Compostables', status: 'Completado' },
    { date: '09 Nov 2025', action: 'Certificado generado', amount: '-', type: 'ODS 12', status: 'Disponible' },
    { date: '07 Nov 2025', action: 'Recolección programada', amount: '38 kg', type: 'Orgánicos', status: 'Completado' },
  ];

  const monthlyData = [
    { month: 'Jul', value: 580 },
    { month: 'Ago', value: 650 },
    { month: 'Sep', value: 720 },
    { month: 'Oct', value: 790 },
    { month: 'Nov', value: 847 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              ¡Hola, <span className="text-gradient">{user.name}</span>! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              {user.establishment} - {user.city}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {user.type === 'restaurant' ? 'Restaurante' :
                 user.type === 'market' ? 'Plaza de Mercado' :
                 user.type === 'hotel' ? 'Hotel' :
                 user.type === 'farm' ? 'Granja' :
                 user.type === 'collection' ? 'Centro de Acopio' : 'Establecimiento'}
              </span>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium flex items-center gap-1">
                <Award className="w-4 h-4" />
                Certificado ODS
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover-lift shadow-soft border-2 hover:border-primary/20 transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.unit}</div>
                </div>
                <Progress value={stat.progress} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <Card className="lg:col-span-2 p-6 shadow-medium">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Residuos Aprovechados</h2>
                  <p className="text-sm text-muted-foreground">Últimos 5 meses</p>
                </div>
                <Button variant="outline" size="sm" className="hover-lift">
                  <Calendar className="w-4 h-4 mr-2" />
                  Este Mes
                </Button>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-4 mt-8">
                {monthlyData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center mb-2 h-48">
                      <div
                        className="w-full gradient-primary rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium">{item.month}</div>
                    <div className="text-xs text-muted-foreground">{item.value}kg</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-bold mb-6">Acciones Rápidas</h2>
              <div className="space-y-3">
                <Button className="w-full gradient-primary hover-lift justify-start" size="lg">
                  <Bell className="w-5 h-5 mr-3" />
                  Programar Recolección
                </Button>
                <Button variant="outline" className="w-full hover-lift justify-start" size="lg">
                  <Download className="w-5 h-5 mr-3" />
                  Descargar Certificado
                </Button>
                <Button variant="outline" className="w-full hover-lift justify-start" size="lg">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Ver Reportes Detallados
                </Button>
                <Button variant="outline" className="w-full hover-lift justify-start" size="lg">
                  <Target className="w-5 h-5 mr-3" />
                  Establecer Metas
                </Button>
              </div>

              <div className="mt-8 p-4 rounded-lg gradient-hero">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-primary-foreground" />
                  <h3 className="font-bold text-primary-foreground">Meta del Mes</h3>
                </div>
                <p className="text-sm text-primary-foreground/90 mb-3">
                  Reducir residuos en un 15% adicional
                </p>
                <Progress value={78} className="h-2 bg-primary-foreground/20" />
                <p className="text-xs text-primary-foreground/80 mt-2">78% completado</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8 p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Actividad Reciente</h2>
              <Button variant="ghost" size="sm">Ver Todo</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acción</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-4 px-4 text-sm">{activity.date}</td>
                      <td className="py-4 px-4 text-sm font-medium">{activity.action}</td>
                      <td className="py-4 px-4 text-sm">{activity.amount}</td>
                      <td className="py-4 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                          {activity.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs">
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
