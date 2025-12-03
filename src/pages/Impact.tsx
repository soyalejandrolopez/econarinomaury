import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Leaf, Recycle, Target, Award, MapPin, Factory } from 'lucide-react';

const Impact = () => {
  const globalStats = [
    { icon: Users, label: 'Establecimientos Conectados', value: '300+', progress: 75, color: 'text-primary' },
    { icon: Recycle, label: 'Residuos Aprovechados (kg)', value: '5,000', progress: 83, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Reducción de Desperdicio', value: '40%', progress: 40, color: 'text-accent' },
    { icon: Award, label: 'Empleos Verdes Generados', value: '120', progress: 60, color: 'text-success' },
  ];

  const environmentalImpact = [
    { label: 'CO₂ Evitado', value: '12,450 kg', icon: Leaf, color: 'bg-success/10 text-success' },
    { label: 'Agua Ahorrada', value: '450,000 L', icon: Recycle, color: 'bg-secondary/10 text-secondary' },
    { label: 'Árboles Equivalentes', value: '680', icon: Leaf, color: 'bg-success/10 text-success' },
    { label: 'Compost Producido', value: '3,200 kg', icon: Factory, color: 'bg-accent/10 text-accent' },
  ];

  const municipalities = [
    { name: 'Pasto', establishments: 145, waste: 2100 },
    { name: 'Ipiales', establishments: 58, waste: 890 },
    { name: 'Tumaco', establishments: 42, waste: 650 },
    { name: 'Túquerres', establishments: 28, waste: 420 },
    { name: 'La Unión', establishments: 18, waste: 310 },
    { name: 'Otros', establishments: 9, waste: 630 },
  ];

  const sdgGoals = [
    {
      number: '12',
      title: 'Producción y Consumo Responsables',
      description: 'Gestión sostenible y uso eficiente de recursos naturales',
      progress: 85,
    },
    {
      number: '13',
      title: 'Acción por el Clima',
      description: 'Reducción de emisiones de gases de efecto invernadero',
      progress: 78,
    },
    {
      number: '8',
      title: 'Trabajo Decente y Crecimiento Económico',
      description: 'Creación de empleos verdes y economía circular',
      progress: 65,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-gradient">Impacto y Resultados</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Datos reales que demuestran cómo EcoNariño está transformando la gestión de residuos en Nariño
            </p>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {globalStats.map((stat, index) => (
              <Card key={index} className="p-6 hover-lift shadow-medium border-2 hover:border-primary/20 transition-smooth">
                <stat.icon className={`w-12 h-12 ${stat.color} mb-4`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-4">{stat.label}</div>
                <Progress value={stat.progress} className="h-2" />
              </Card>
            ))}
          </div>

          {/* Environmental Impact */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="text-gradient">Impacto Ambiental</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {environmentalImpact.map((item, index) => (
                <Card key={index} className="p-8 text-center hover-lift shadow-soft">
                  <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <Card className="p-8 mb-16 shadow-strong">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">Cobertura por Municipio</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-4 px-4 font-bold">Municipio</th>
                    <th className="text-right py-4 px-4 font-bold">Establecimientos</th>
                    <th className="text-right py-4 px-4 font-bold">Residuos (kg/mes)</th>
                    <th className="text-left py-4 px-4 font-bold">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {municipalities.map((muni, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-4 px-4 font-medium">{muni.name}</td>
                      <td className="py-4 px-4 text-right">{muni.establishments}</td>
                      <td className="py-4 px-4 text-right font-bold text-primary">{muni.waste.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <Progress value={(muni.establishments / 300) * 100} className="h-2" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* SDG Goals */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Contribución a los <span className="text-gradient">Objetivos de Desarrollo Sostenible</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {sdgGoals.map((goal, index) => (
                <Card key={index} className="p-8 hover-lift shadow-medium border-2 hover:border-primary/20 transition-smooth">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
                      <span className="text-2xl font-bold">ODS {goal.number}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{goal.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-bold text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quote Section */}
          <Card className="p-12 gradient-hero text-primary-foreground text-center shadow-strong">
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl mb-6 opacity-50">"</div>
              <p className="text-2xl font-medium mb-6 italic">
                Cuidar el planeta comienza con pequeñas acciones que generan grandes cambios
              </p>
              <div className="w-20 h-1 bg-primary-foreground/30 mx-auto mb-6"></div>
              <p className="text-lg opacity-90">
                Cada establecimiento que se une a EcoNariño contribuye directamente a la sostenibilidad de Nariño y al bienestar de las futuras generaciones.
              </p>
            </div>
          </Card>

          {/* Timeline */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="text-gradient">Nuestro Crecimiento</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {[
                  { month: 'Enero 2025', milestone: 'Lanzamiento de EcoNariño', value: '50 establecimientos' },
                  { month: 'Marzo 2025', milestone: 'Expansión a 5 municipios', value: '120 establecimientos' },
                  { month: 'Junio 2025', milestone: 'Primera tonelada reciclada', value: '1,000 kg aprovechados' },
                  { month: 'Septiembre 2025', milestone: 'Certificación ODS implementada', value: '200 establecimientos' },
                  { month: 'Noviembre 2025', milestone: 'Cobertura departamental', value: '300+ establecimientos' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      {index !== 4 && <div className="w-0.5 h-16 bg-border ml-1.5 mt-2"></div>}
                    </div>
                    <Card className="flex-1 p-6 hover-lift shadow-soft">
                      <div className="text-sm text-primary font-semibold mb-2">{item.month}</div>
                      <h3 className="font-bold text-lg mb-2">{item.milestone}</h3>
                      <p className="text-muted-foreground">{item.value}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Impact;
