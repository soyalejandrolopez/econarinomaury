import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Download,
  Loader2,
  Leaf,
  Droplets,
  Zap,
  Recycle,
  Building2,
  MapPin,
  Award
} from 'lucide-react';

interface MonthlyData {
  month: string;
  monthNum: number;
  year: number;
  organicos: number;
  compostables: number;
  reciclables: number;
  mixtos: number;
  total: number;
}

interface ReportStats {
  totalWaste: number;
  co2Reduced: number;
  waterSaved: number;
  energySaved: number;
  compostGenerated: number;
  collectionsCount: number;
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    totalWaste: 0,
    co2Reduced: 0,
    waterSaved: 0,
    energySaved: 0,
    compostGenerated: 0,
    collectionsCount: 0
  });

  // Cargar datos reales de collections
  useEffect(() => {
    const loadReportData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data: collections, error } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) throw error;

        if (collections && collections.length > 0) {
          // Calcular totales
          const totalWaste = collections.reduce((sum, col) => sum + (Number(col.estimated_weight) || 0), 0);

          setStats({
            totalWaste,
            co2Reduced: totalWaste * 0.5,
            waterSaved: totalWaste * 1.5,
            energySaved: totalWaste * 0.4,
            compostGenerated: totalWaste * 0.6,
            collectionsCount: collections.length
          });

          // Agrupar por mes
          const monthlyMap = new Map<string, MonthlyData>();
          const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

          collections.forEach(col => {
            const date = new Date(col.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthName = monthNames[date.getMonth()];
            const weight = Number(col.estimated_weight) || 0;

            if (!monthlyMap.has(monthKey)) {
              monthlyMap.set(monthKey, {
                month: `${monthName} ${date.getFullYear()}`,
                monthNum: date.getMonth(),
                year: date.getFullYear(),
                organicos: 0,
                compostables: 0,
                reciclables: 0,
                mixtos: 0,
                total: 0
              });
            }

            const monthData = monthlyMap.get(monthKey)!;
            monthData.total += weight;

            // Clasificar por tipo
            switch (col.waste_type) {
              case 'organicos':
                monthData.organicos += weight;
                break;
              case 'compostables':
                monthData.compostables += weight;
                break;
              case 'reciclables':
                monthData.reciclables += weight;
                break;
              default:
                monthData.mixtos += weight;
            }
          });

          // Convertir a array y ordenar por fecha
          const sortedMonthly = Array.from(monthlyMap.values())
            .sort((a, b) => {
              if (a.year !== b.year) return b.year - a.year;
              return b.monthNum - a.monthNum;
            });

          setMonthlyData(sortedMonthly);
        }
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [user?.id]);

  const impactData = [
    {
      metric: 'CO₂ Evitado',
      value: `${Math.round(stats.co2Reduced)} kg`,
      icon: Leaf,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: '0.5 kg CO₂ por cada kg de residuos'
    },
    {
      metric: 'Agua Ahorrada',
      value: `${Math.round(stats.waterSaved)} L`,
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: '1.5 L por cada kg de residuos'
    },
    {
      metric: 'Energía Ahorrada',
      value: `${Math.round(stats.energySaved)} kWh`,
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      description: '0.4 kWh por cada kg de residuos'
    },
    {
      metric: 'Compost Generado',
      value: `${Math.round(stats.compostGenerated)} kg`,
      icon: Recycle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: '60% del peso se convierte en compost'
    }
  ];

  // Calcular máximo para la barra de progreso
  const maxMonthlyTotal = Math.max(...monthlyData.map(m => m.total), 1);

  const getCityLabel = (city: string) => {
    const cities: { [key: string]: string } = {
      'pasto': 'Pasto',
      'ipiales': 'Ipiales',
      'tumaco': 'Tumaco',
      'tuquerres': 'Túquerres',
      'sandona': 'Sandoná',
      'la_union': 'La Unión',
      'samaniego': 'Samaniego',
      'other': 'Nariño'
    };
    return cities[city?.toLowerCase()] || city || 'tu ciudad';
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reportes Detallados</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {user?.establishment}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Este Año
              </Button>
              <Button className="gradient-primary">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Residuos</div>
              <div className="text-2xl font-bold text-primary">
                {loading ? '...' : `${Math.round(stats.totalWaste)} kg`}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Recolecciones</div>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.collectionsCount}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Meses Activos</div>
              <div className="text-2xl font-bold">
                {loading ? '...' : monthlyData.length}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Promedio/Mes</div>
              <div className="text-2xl font-bold text-secondary">
                {loading ? '...' : `${Math.round(stats.totalWaste / Math.max(monthlyData.length, 1))} kg`}
              </div>
            </Card>
          </div>

          <Tabs defaultValue="monthly" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mensual
              </TabsTrigger>
              <TabsTrigger value="impact" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Impacto Ambiental
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Comparativa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Residuos por Mes</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando datos...</p>
                  </div>
                ) : monthlyData.length > 0 ? (
                  <div className="space-y-6">
                    {/* Tabla */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Mes</th>
                            <th className="text-right py-3 px-4">Orgánicos</th>
                            <th className="text-right py-3 px-4">Compostables</th>
                            <th className="text-right py-3 px-4">Reciclables</th>
                            <th className="text-right py-3 px-4">Mixtos</th>
                            <th className="text-right py-3 px-4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyData.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{row.month}</td>
                              <td className="text-right py-3 px-4">{Math.round(row.organicos)} kg</td>
                              <td className="text-right py-3 px-4">{Math.round(row.compostables)} kg</td>
                              <td className="text-right py-3 px-4">{Math.round(row.reciclables)} kg</td>
                              <td className="text-right py-3 px-4">{Math.round(row.mixtos)} kg</td>
                              <td className="text-right py-3 px-4 font-bold text-primary">{Math.round(row.total)} kg</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-muted/30 font-bold">
                            <td className="py-3 px-4">TOTAL</td>
                            <td className="text-right py-3 px-4">{Math.round(monthlyData.reduce((s, r) => s + r.organicos, 0))} kg</td>
                            <td className="text-right py-3 px-4">{Math.round(monthlyData.reduce((s, r) => s + r.compostables, 0))} kg</td>
                            <td className="text-right py-3 px-4">{Math.round(monthlyData.reduce((s, r) => s + r.reciclables, 0))} kg</td>
                            <td className="text-right py-3 px-4">{Math.round(monthlyData.reduce((s, r) => s + r.mixtos, 0))} kg</td>
                            <td className="text-right py-3 px-4 text-primary">{Math.round(stats.totalWaste)} kg</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Gráfico de barras simple */}
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-4">Tendencia Mensual</h3>
                      <div className="space-y-3">
                        {monthlyData.slice(0, 6).map((row, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{row.month}</span>
                              <span className="font-medium">{Math.round(row.total)} kg</span>
                            </div>
                            <Progress value={(row.total / maxMonthlyTotal) * 100} className="h-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aún no tienes datos mensuales</h3>
                    <p className="text-muted-foreground mb-6">Comienza programando recolecciones para ver tus estadísticas</p>
                    <Button onClick={() => navigate('/programar-recoleccion')} className="gradient-primary">
                      Programar Primera Recolección
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {impactData.map((item, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.metric}</h3>
                        </div>
                        <p className="text-3xl font-bold text-primary mb-1">
                          {loading ? '...' : item.value}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Resumen de impacto */}
              <Card className="p-6 gradient-cool text-primary-foreground">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Tu Impacto Total</h3>
                </div>
                <p className="opacity-90 mb-4">
                  Con {Math.round(stats.totalWaste)} kg de residuos aprovechados, has contribuido significativamente
                  a la economía circular en Nariño. Equivale a evitar la emisión de CO₂ de un auto
                  recorriendo {Math.round(stats.co2Reduced * 4)} km.
                </p>
                <Button variant="secondary" onClick={() => navigate('/certificado')}>
                  Ver Mi Certificado
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Comparativa Regional</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Tu establecimiento */}
                    <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">{user?.establishment || 'Tu establecimiento'}</p>
                            <p className="text-sm text-muted-foreground">{stats.collectionsCount} recolecciones</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{Math.round(stats.totalWaste)} kg</p>
                          <p className="text-xs text-muted-foreground">este año</p>
                        </div>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    {/* Promedio ciudad */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-semibold">Promedio en {getCityLabel(user?.city || '')}</p>
                            <p className="text-sm text-muted-foreground">Establecimientos similares</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">620 kg</p>
                          <p className="text-xs text-muted-foreground">por establecimiento</p>
                        </div>
                      </div>
                      <Progress value={Math.min((620 / Math.max(stats.totalWaste, 1)) * 100, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {stats.totalWaste >= 620
                          ? `¡Estás ${Math.round(((stats.totalWaste - 620) / 620) * 100)}% por encima del promedio!`
                          : `Te faltan ${Math.round(620 - stats.totalWaste)} kg para alcanzar el promedio`
                        }
                      </p>
                    </div>

                    {/* Promedio Nariño */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold">Promedio en Nariño</p>
                            <p className="text-sm text-muted-foreground">Todos los establecimientos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">580 kg</p>
                          <p className="text-xs text-muted-foreground">por establecimiento</p>
                        </div>
                      </div>
                      <Progress value={Math.min((580 / Math.max(stats.totalWaste, 1)) * 100, 100)} className="h-2" />
                    </div>

                    {/* Top performers */}
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-semibold text-success">Top 10% de la región</p>
                            <p className="text-sm text-muted-foreground">Los mejores establecimientos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-success">1,200+ kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;
