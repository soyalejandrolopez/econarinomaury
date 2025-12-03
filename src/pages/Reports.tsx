import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserData';
import DashboardSidebar from '@/components/DashboardSidebar';
import { ArrowLeft, TrendingUp, Calendar, Download, Loader2 } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading } = useUserStats();

  // Datos mensuales reales del usuario (vacío por ahora, se llenará con datos de Supabase)
  const monthlyData: any[] = [];

  const impactData = [
    { metric: 'CO₂ Evitado', value: loading ? '...' : `${Math.round(stats.co2Reduced)} kg`, change: '+18%' },
    { metric: 'Agua Ahorrada', value: loading ? '...' : `${Math.round(stats.wasteCollected * 1.5)} L`, change: '+12%' },
    { metric: 'Energía Ahorrada', value: loading ? '...' : `${Math.round(stats.wasteCollected * 0.4)} kWh`, change: '+15%' },
    { metric: 'Compost Generado', value: loading ? '...' : `${Math.round(stats.wasteCollected * 0.6)} kg`, change: '+20%' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Reportes Detallados</h1>
              <p className="text-muted-foreground">{user?.establishment}</p>
            </div>
            <Button className="gradient-primary">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <Tabs defaultValue="monthly" className="space-y-6">
            <TabsList>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="impact">Impacto Ambiental</TabsTrigger>
              <TabsTrigger value="comparison">Comparativa</TabsTrigger>
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
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Mes</th>
                          <th className="text-right py-3 px-4">Orgánicos</th>
                          <th className="text-right py-3 px-4">Compostables</th>
                          <th className="text-right py-3 px-4">Reciclables</th>
                          <th className="text-right py-3 px-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((row, i) => (
                          <tr key={i} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 font-medium">{row.month}</td>
                            <td className="text-right py-3 px-4">{row.organicos} kg</td>
                            <td className="text-right py-3 px-4">{row.compostables} kg</td>
                            <td className="text-right py-3 px-4">{row.reciclables} kg</td>
                            <td className="text-right py-3 px-4 font-bold">{row.total} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aún no tienes datos mensuales</h3>
                    <p className="text-muted-foreground mb-6">Comienza programando recolecciones para ver tus estadísticas mensuales</p>
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
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">{item.metric}</h3>
                      <span className="text-xs text-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.change}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                  </Card>
                ))}
              </div>
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
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <div>
                        <p className="font-semibold">Tu establecimiento</p>
                        <p className="text-sm text-muted-foreground">{Math.round(stats.wasteCollected)} kg este año</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">100%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold">Promedio en {user?.city || 'tu ciudad'}</p>
                        <p className="text-sm text-muted-foreground">620 kg por establecimiento</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{Math.round((620 / Math.max(stats.wasteCollected, 1)) * 100)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold">Promedio en Nariño</p>
                        <p className="text-sm text-muted-foreground">580 kg por establecimiento</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{Math.round((580 / Math.max(stats.wasteCollected, 1)) * 100)}%</p>
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
