import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, TrendingUp, Calendar, Download } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const monthlyData = [
    { month: 'Enero', organicos: 120, compostables: 80, reciclables: 45, total: 245 },
    { month: 'Febrero', organicos: 135, compostables: 90, reciclables: 50, total: 275 },
    { month: 'Marzo', organicos: 150, compostables: 95, reciclables: 55, total: 300 },
    { month: 'Abril', organicos: 145, compostables: 100, reciclables: 60, total: 305 },
    { month: 'Mayo', organicos: 160, compostables: 105, reciclables: 65, total: 330 }
  ];

  const impactData = [
    { metric: 'CO₂ Evitado', value: '423 kg', change: '+18%' },
    { metric: 'Agua Ahorrada', value: '1,250 L', change: '+12%' },
    { metric: 'Energía Ahorrada', value: '340 kWh', change: '+15%' },
    { metric: 'Compost Generado', value: '520 kg', change: '+20%' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div>
                      <p className="font-semibold">Tu establecimiento</p>
                      <p className="text-sm text-muted-foreground">847 kg este mes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">100%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Promedio en Pasto</p>
                      <p className="text-sm text-muted-foreground">620 kg por establecimiento</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">73%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Promedio en Nariño</p>
                      <p className="text-sm text-muted-foreground">580 kg por establecimiento</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">68%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Reports;
