import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrazabilidadController } from '@/controllers/TrazabilidadController';
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
  Calendar,
  Loader2,
  Eye,
  Globe,
  RefreshCw
} from 'lucide-react';

interface TrazabilidadViewProps {
  userId: string | undefined;
}

const TrazabilidadView = ({ userId }: TrazabilidadViewProps) => {
  const {
    state,
    loadAllData,
    getStepStatusLabel,
    getBatchStatusLabel,
    getOverallProgress
  } = useTrazabilidadController(userId);

  // Iconos para los pasos de trazabilidad
  const stepIcons: { [key: string]: any } = {
    'Generación': Building2,
    'Recolección': Truck,
    'Procesamiento': Factory,
    'Transformación': Recycle,
    'Distribución': TreePine
  };

  // Colores para los pasos
  const stepColors: { [key: string]: string } = {
    'Generación': 'bg-primary',
    'Recolección': 'bg-secondary',
    'Procesamiento': 'bg-accent',
    'Transformación': 'bg-info',
    'Distribución': 'bg-success'
  };

  // Iconos para los beneficiarios
  const beneficiaryIcons: { [key: string]: any } = {
    'farms': TreePine,
    'processing': Factory,
    'routes': Truck
  };

  // Colores para los beneficiarios
  const beneficiaryColors: { [key: string]: string } = {
    'farms': 'bg-success/10 text-success',
    'processing': 'bg-secondary/10 text-secondary',
    'routes': 'bg-primary/10 text-primary'
  };

  const impactCards = [
    { label: 'CO₂ Evitado', value: `${state.impactMetrics.co2Avoided} kg`, icon: Leaf, color: 'text-success' },
    { label: 'Compost Generado', value: `${state.impactMetrics.compostGenerated} kg`, icon: Recycle, color: 'text-secondary' },
    { label: 'Granjas Beneficiadas', value: state.impactMetrics.farmsHelped.toString(), icon: TreePine, color: 'text-accent' },
    { label: 'Puntos Ganados', value: state.impactMetrics.pointsEarned.toLocaleString(), icon: Award, color: 'text-primary' }
  ];

  return (
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
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => loadAllData()}
              className="hover-lift"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" className="hover-lift border-2">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {impactCards.map((metric, index) => (
          <Card key={index} className="p-4 hover-lift shadow-medium border-2 border-transparent hover:border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {state.initialLoading ? '...' : metric.value}
                </div>
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
                <h2 className="text-2xl font-bold mb-1">
                  {state.lastCollection ? `Último Lote: ${state.lastCollection.id}` : 'Sin lotes registrados'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {state.lastCollection
                    ? `${state.lastCollection.weight} kg de residuos orgánicos • ${state.lastCollection.date}`
                    : 'Programa tu primera recolección para comenzar'}
                </p>
              </div>
              {state.traceabilitySteps.length > 0 && (
                <span className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${
                  getOverallProgress() === 100
                    ? 'bg-success/10 text-success'
                    : 'bg-accent/10 text-accent'
                }`}>
                  {getOverallProgress() === 100 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {getOverallProgress() === 100 ? 'Completado' : 'En Proceso'}
                </span>
              )}
            </div>

            {state.initialLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : state.traceabilitySteps.length > 0 ? (
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-border"></div>
                <div
                  className="absolute left-7 top-0 w-0.5 gradient-primary transition-all duration-1000"
                  style={{ height: `${getOverallProgress()}%` }}
                ></div>

                {/* Steps */}
                <div className="space-y-8">
                  {state.traceabilitySteps.map((step, index) => {
                    const IconComponent = stepIcons[step.title] || Package;
                    const bgColor = stepColors[step.title] || 'bg-muted';

                    return (
                      <div key={index} className="relative flex gap-6">
                        <div className={`relative z-10 w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center shadow-medium ${
                          step.status === 'completed' ? 'opacity-100' :
                          step.status === 'in_progress' ? 'animate-pulse' : 'opacity-50'
                        }`}>
                          <IconComponent className="w-7 h-7 text-primary-foreground" />
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
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos de trazabilidad</p>
                <p className="text-sm">Programa tu primera recolección para comenzar el seguimiento</p>
                <Link to="/programar-recoleccion">
                  <Button className="mt-4 gradient-primary">
                    Programar Recolección
                  </Button>
                </Link>
              </div>
            )}
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

            {state.initialLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : state.batches.length > 0 ? (
              <div className="space-y-4">
                {state.batches.map((batch, index) => (
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
                          <div className="font-medium">{batch.weight} kg</div>
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
                          {getBatchStatusLabel(batch.status)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay lotes registrados</p>
                <p className="text-sm">Los lotes aparecerán cuando programes recolecciones</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          {state.initialLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-medium">
                <h2 className="text-2xl font-bold mb-6">Impacto Ambiental Acumulado</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">CO₂ Evitado</span>
                      <span className="text-success font-bold">{state.accumulatedImpact.co2Avoided} kg</span>
                    </div>
                    <Progress
                      value={Math.min((state.accumulatedImpact.co2Avoided / state.accumulatedImpact.co2Goal) * 100, 100)}
                      className="h-3"
                    />
                    <div className="text-xs text-muted-foreground mt-1">Meta: {state.accumulatedImpact.co2Goal} kg</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Residuos Aprovechados</span>
                      <span className="text-primary font-bold">{state.accumulatedImpact.wasteRecycled} kg</span>
                    </div>
                    <Progress
                      value={Math.min((state.accumulatedImpact.wasteRecycled / state.accumulatedImpact.wasteGoal) * 100, 100)}
                      className="h-3"
                    />
                    <div className="text-xs text-muted-foreground mt-1">Meta: {state.accumulatedImpact.wasteGoal} kg</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Compost Generado</span>
                      <span className="text-secondary font-bold">{state.accumulatedImpact.compostGenerated} kg</span>
                    </div>
                    <Progress
                      value={Math.min((state.accumulatedImpact.compostGenerated / state.accumulatedImpact.compostGoal) * 100, 100)}
                      className="h-3"
                    />
                    <div className="text-xs text-muted-foreground mt-1">Meta: {state.accumulatedImpact.compostGoal} kg</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-medium">
                <h2 className="text-2xl font-bold mb-6">Beneficiarios del Programa</h2>
                <div className="space-y-4">
                  {state.beneficiaries.map((beneficiary, index) => {
                    const IconComponent = beneficiaryIcons[beneficiary.type] || TreePine;
                    const colorClass = beneficiaryColors[beneficiary.type] || 'bg-muted text-muted-foreground';

                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass.split(' ')[0]}`}>
                            <IconComponent className={`w-5 h-5 ${colorClass.split(' ')[1]}`} />
                          </div>
                          <div>
                            <div className="font-medium">{beneficiary.label}</div>
                            <div className="text-xs text-muted-foreground">{beneficiary.description}</div>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${colorClass.split(' ')[1]}`}>
                          {beneficiary.count}
                        </div>
                      </div>
                    );
                  })}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrazabilidadView;
