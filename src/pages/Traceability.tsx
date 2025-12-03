import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  ArrowRight,
  Building2,
  Truck,
  Factory,
  TreePine,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Recycle,
  Leaf,
  Award,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Loader2,
  Eye,
  Target,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';

const Traceability = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando trazabilidad...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const traceabilitySteps = [
    {
      step: 1,
      title: 'Generación',
      status: 'completed',
      location: user.establishment,
      date: '13 Nov 2025',
      time: '07:30 AM',
      details: '45 kg de residuos orgánicos clasificados',
      icon: Building2,
      color: 'bg-primary'
    },
    {
      step: 2,
      title: 'Recolección',
      status: 'completed',
      location: 'Ruta Norte - Vehículo EC-015',
      date: '13 Nov 2025',
      time: '09:15 AM',
      details: 'Residuos recogidos y verificados',
      icon: Truck,
      color: 'bg-secondary'
    },
    {
      step: 3,
      title: 'Procesamiento',
      status: 'in_progress',
      location: 'Centro de Acopio La Esperanza',
      date: '13 Nov 2025',
      time: '11:30 AM',
      details: 'En proceso de clasificación final',
      icon: Factory,
      color: 'bg-accent'
    },
    {
      step: 4,
      title: 'Transformación',
      status: 'pending',
      location: 'Planta de Compostaje EcoNariño',
      date: 'Estimado: 14 Nov',
      time: '-',
      details: 'Conversión a compost orgánico',
      icon: Recycle,
      color: 'bg-info'
    },
    {
      step: 5,
      title: 'Distribución',
      status: 'pending',
      location: 'Granjas asociadas',
      date: 'Estimado: 20 Nov',
      time: '-',
      details: 'Entrega a productores agrícolas',
      icon: TreePine,
      color: 'bg-success'
    }
  ];

  const recentBatches = [
    {
      id: 'ECO-2025-1542',
      date: '13 Nov 2025',
      weight: '45 kg',
      type: 'Orgánicos',
      status: 'in_progress',
      progress: 60,
      destination: 'Compostaje'
    },
    {
      id: 'ECO-2025-1538',
      date: '11 Nov 2025',
      weight: '52 kg',
      type: 'Compostables',
      status: 'completed',
      progress: 100,
      destination: 'Alimento Animal'
    },
    {
      id: 'ECO-2025-1530',
      date: '07 Nov 2025',
      weight: '38 kg',
      type: 'Orgánicos',
      status: 'completed',
      progress: 100,
      destination: 'Compostaje'
    },
    {
      id: 'ECO-2025-1524',
      date: '03 Nov 2025',
      weight: '41 kg',
      type: 'Orgánicos',
      status: 'completed',
      progress: 100,
      destination: 'Compostaje'
    }
  ];

  const impactMetrics = [
    { label: 'CO₂ Evitado', value: '423 kg', icon: Leaf, color: 'text-success' },
    { label: 'Compost Generado', value: '680 kg', icon: Recycle, color: 'text-secondary' },
    { label: 'Granjas Beneficiadas', value: '8', icon: TreePine, color: 'text-accent' },
    { label: 'Puntos Ganados', value: '1,247', icon: Award, color: 'text-primary' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Sistema de Trazabilidad</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="text-gradient">Trazabilidad</span> de Residuos
                </h1>
                <p className="text-muted-foreground">
                  Sigue el recorrido de tus residuos desde la generación hasta su aprovechamiento final
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" className="hover-lift border-2">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="p-4 hover-lift shadow-medium border-2 border-transparent hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{metric.value}</div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="tracking" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Seguimiento Actual
              </TabsTrigger>
              <TabsTrigger value="batches" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Mis Lotes
              </TabsTrigger>
              <TabsTrigger value="impact" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Impacto Acumulado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Último Lote: ECO-2025-1542</h2>
                    <p className="text-sm text-muted-foreground">45 kg de residuos orgánicos • 13 Nov 2025</p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    En Proceso
                  </span>
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-border"></div>
                  <div
                    className="absolute left-7 top-0 w-0.5 gradient-primary transition-all duration-1000"
                    style={{ height: '60%' }}
                  ></div>

                  {/* Steps */}
                  <div className="space-y-8">
                    {traceabilitySteps.map((step, index) => (
                      <div key={index} className="relative flex gap-6">
                        <div className={`relative z-10 w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-medium ${
                          step.status === 'completed' ? 'opacity-100' :
                          step.status === 'in_progress' ? 'animate-pulse' : 'opacity-50'
                        }`}>
                          <step.icon className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <Card className={`flex-1 p-5 transition-smooth ${
                          step.status === 'completed' ? 'border-success/30 bg-success/5' :
                          step.status === 'in_progress' ? 'border-accent/30 bg-accent/5' :
                          'border-border opacity-60'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-muted-foreground">Paso {step.step}</span>
                                {step.status === 'completed' && (
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                )}
                                {step.status === 'in_progress' && (
                                  <Clock className="w-4 h-4 text-accent animate-pulse" />
                                )}
                              </div>
                              <h3 className="text-lg font-bold">{step.title}</h3>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{step.date}</div>
                              <div className="text-muted-foreground">{step.time}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4" />
                            {step.location}
                          </div>
                          <p className="text-sm">{step.details}</p>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="batches">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Historial de Lotes</h2>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentBatches.map((batch, index) => (
                    <Card
                      key={index}
                      className={`p-5 border-2 transition-smooth hover-lift cursor-pointer ${
                        batch.status === 'in_progress' ? 'border-accent/30' : 'border-border'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            batch.status === 'completed' ? 'bg-success/10' : 'bg-accent/10'
                          }`}>
                            <Package className={`w-6 h-6 ${
                              batch.status === 'completed' ? 'text-success' : 'text-accent'
                            }`} />
                          </div>
                          <div>
                            <div className="font-bold">{batch.id}</div>
                            <div className="text-sm text-muted-foreground">{batch.date}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div>
                            <div className="text-muted-foreground">Peso</div>
                            <div className="font-medium">{batch.weight}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Tipo</div>
                            <div className="font-medium">{batch.type}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Destino</div>
                            <div className="font-medium">{batch.destination}</div>
                          </div>
                          <div className="min-w-[120px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progreso</span>
                              <span className="font-medium">{batch.progress}%</span>
                            </div>
                            <Progress value={batch.progress} className="h-2" />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            batch.status === 'completed'
                              ? 'bg-success/10 text-success'
                              : 'bg-accent/10 text-accent'
                          }`}>
                            {batch.status === 'completed' ? 'Completado' : 'En proceso'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 shadow-medium">
                  <h2 className="text-2xl font-bold mb-6">Impacto Ambiental Acumulado</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">CO₂ Evitado</span>
                        <span className="text-success font-bold">423 kg</span>
                      </div>
                      <Progress value={85} className="h-3" />
                      <div className="text-xs text-muted-foreground mt-1">Meta: 500 kg</div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Residuos Aprovechados</span>
                        <span className="text-primary font-bold">847 kg</span>
                      </div>
                      <Progress value={85} className="h-3" />
                      <div className="text-xs text-muted-foreground mt-1">Meta: 1,000 kg</div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Compost Generado</span>
                        <span className="text-secondary font-bold">680 kg</span>
                      </div>
                      <Progress value={68} className="h-3" />
                      <div className="text-xs text-muted-foreground mt-1">Meta: 1,000 kg</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-medium">
                  <h2 className="text-2xl font-bold mb-6">Beneficiarios del Programa</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <TreePine className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <div className="font-medium">Granjas Beneficiadas</div>
                          <div className="text-xs text-muted-foreground">Reciben compost y alimento</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-success">8</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Factory className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">Centros de Procesamiento</div>
                          <div className="text-xs text-muted-foreground">Transforman los residuos</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-secondary">3</div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Rutas de Recolección</div>
                          <div className="text-xs text-muted-foreground">Vehículos asignados</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">2</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-medium md:col-span-2 gradient-cool text-primary-foreground relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">Tu Certificado de Trazabilidad</h3>
                    </div>
                    <p className="mb-6 opacity-90 max-w-2xl">
                      Todos tus residuos son rastreados desde el momento de la generación hasta su aprovechamiento final.
                      Esto garantiza transparencia y te permite demostrar tu compromiso con la sostenibilidad.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/certificado">
                        <Button className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">
                          Descargar Certificado
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
                        Ver Detalles Completos
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Traceability;
