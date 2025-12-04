import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight,
  ArrowLeft,
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
  collectionId?: string | null;
}

interface Collection {
  id: string;
  date: string;
  time: string;
  waste_type: string;
  estimated_weight: number;
  status: string;
  notes: string;
}

interface TraceabilityStep {
  step: number;
  title: string;
  date: string;
  time: string;
  location: string;
  details: string;
  status: 'completed' | 'in_progress' | 'pending';
}

const TrazabilidadView = ({ userId, collectionId }: TrazabilidadViewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [steps, setSteps] = useState<TraceabilityStep[]>([]);

  // Mapeo de etapas a índices
  const STEP_ORDER = ['generacion', 'recoleccion', 'procesamiento', 'transformacion', 'distribucion'];

  // Generar pasos de trazabilidad basados en la recolección
  const generateSteps = useCallback((col: Collection & { traceability_step?: string }): TraceabilityStep[] => {
    const colDate = new Date(col.date);
    const formatDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    const wasteTypeLabels: { [key: string]: string } = {
      'organicos': 'orgánicos',
      'compostables': 'compostables',
      'reciclables': 'reciclables',
      'mixtos': 'mixtos'
    };
    const wasteLabel = wasteTypeLabels[col.waste_type] || col.waste_type;

    // Obtener el índice de la etapa actual
    const currentStep = col.traceability_step || 'generacion';
    const currentStepIndex = STEP_ORDER.indexOf(currentStep);

    // Fechas estimadas basadas en el estado
    const recoleccionDate = new Date(colDate);
    const procesamientoDate = new Date(colDate);
    procesamientoDate.setDate(procesamientoDate.getDate() + 1);
    const transformacionDate = new Date(colDate);
    transformacionDate.setDate(transformacionDate.getDate() + 3);
    const distribucionDate = new Date(colDate);
    distribucionDate.setDate(distribucionDate.getDate() + 7);

    // Función para determinar el estado de cada paso
    const getStepStatus = (stepIndex: number): 'completed' | 'in_progress' | 'pending' => {
      if (stepIndex < currentStepIndex) return 'completed';
      if (stepIndex === currentStepIndex) return 'in_progress';
      return 'pending';
    };

    return [
      {
        step: 1,
        title: 'Generación',
        date: formatDate(colDate),
        time: col.time,
        location: user?.establishment || 'Tu establecimiento',
        details: `${col.estimated_weight} kg de residuos ${wasteLabel} clasificados`,
        status: getStepStatus(0)
      },
      {
        step: 2,
        title: 'Recolección',
        date: formatDate(recoleccionDate),
        time: col.time,
        location: 'Ruta de recolección asignada',
        details: getStepStatus(1) === 'completed' ? 'Recolección realizada exitosamente' : 'Pendiente de recolección',
        status: getStepStatus(1)
      },
      {
        step: 3,
        title: 'Procesamiento',
        date: getStepStatus(2) === 'completed' ? formatDate(procesamientoDate) : `Estimado: ${procesamientoDate.getDate()} ${procesamientoDate.toLocaleDateString('es-ES', { month: 'short' })}`,
        time: getStepStatus(2) === 'completed' ? '10:00' : '-',
        location: 'Centro de Acopio EcoNariño',
        details: getStepStatus(2) === 'completed' ? 'Clasificación y pesaje completado' : 'En espera de procesamiento',
        status: getStepStatus(2)
      },
      {
        step: 4,
        title: 'Transformación',
        date: getStepStatus(3) === 'completed' ? formatDate(transformacionDate) : `Estimado: ${transformacionDate.getDate()} ${transformacionDate.toLocaleDateString('es-ES', { month: 'short' })}`,
        time: getStepStatus(3) === 'completed' ? '14:00' : '-',
        location: 'Planta de Compostaje EcoNariño',
        details: 'Conversión a compost orgánico',
        status: getStepStatus(3)
      },
      {
        step: 5,
        title: 'Distribución',
        date: getStepStatus(4) === 'completed' ? formatDate(distribucionDate) : `Estimado: ${distribucionDate.getDate()} ${distribucionDate.toLocaleDateString('es-ES', { month: 'short' })}`,
        time: getStepStatus(4) === 'completed' ? '09:00' : '-',
        location: 'Granjas asociadas',
        details: 'Entrega a productores agrícolas',
        status: getStepStatus(4)
      }
    ];
  }, [user?.establishment]);

  // Cargar datos
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      if (collectionId) {
        // Cargar recolección específica
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('id', collectionId)
          .single();

        if (error) throw error;
        if (data) {
          setCollection(data);
          setSteps(generateSteps(data));
        }
      } else {
        // Cargar todas las recolecciones del usuario
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;
        setCollections(data || []);

        // Si hay recolecciones, mostrar la primera
        if (data && data.length > 0) {
          setCollection(data[0]);
          setSteps(generateSteps(data[0]));
        }
      }
    } catch (error) {
      console.error('Error loading traceability data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, collectionId, generateSteps]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Seleccionar una recolección
  const selectCollection = (col: Collection) => {
    setCollection(col);
    setSteps(generateSteps(col));
  };

  // Helpers
  const getOverallProgress = () => {
    if (steps.length === 0) return 0;
    const completed = steps.filter(s => s.status === 'completed').length;
    return Math.round((completed / steps.length) * 100);
  };

  const getWasteTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'organicos': 'Orgánicos',
      'compostables': 'Compostables',
      'reciclables': 'Reciclables',
      'mixtos': 'Mixtos'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Proceso';
      default: return 'Pendiente';
    }
  };

  // Iconos para los pasos
  const stepIcons: { [key: string]: any } = {
    'Generación': Building2,
    'Recolección': Truck,
    'Procesamiento': Factory,
    'Transformación': Recycle,
    'Distribución': TreePine
  };

  const stepColors: { [key: string]: string } = {
    'Generación': 'bg-primary',
    'Recolección': 'bg-secondary',
    'Procesamiento': 'bg-accent',
    'Transformación': 'bg-info',
    'Distribución': 'bg-success'
  };

  // Calcular impacto estimado
  const estimatedImpact = collection ? {
    co2Avoided: Math.round(collection.estimated_weight * 0.5),
    compostGenerated: Math.round(collection.estimated_weight * 0.6),
    farmsHelped: Math.max(1, Math.round(collection.estimated_weight / 50)),
    pointsEarned: Math.round(collection.estimated_weight * 1.5)
  } : { co2Avoided: 0, compostGenerated: 0, farmsHelped: 0, pointsEarned: 0 };

  const impactCards = [
    { label: 'CO₂ Evitado', value: `${estimatedImpact.co2Avoided} kg`, icon: Leaf, color: 'text-success' },
    { label: 'Compost Estimado', value: `${estimatedImpact.compostGenerated} kg`, icon: Recycle, color: 'text-secondary' },
    { label: 'Granjas Beneficiadas', value: estimatedImpact.farmsHelped.toString(), icon: TreePine, color: 'text-accent' },
    { label: 'Puntos Ganados', value: estimatedImpact.pointsEarned.toLocaleString(), icon: Award, color: 'text-primary' }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Button variant="ghost" onClick={() => navigate('/programar-recoleccion')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Recolecciones
            </Button>
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
            <Button variant="outline" onClick={loadData} className="hover-lift">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
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
                  {isLoading ? '...' : metric.value}
                </div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Seguimiento
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Mis Recolecciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking">
          <Card className="p-6 shadow-medium">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : collection ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Recolección del {new Date(collection.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {collection.estimated_weight} kg de {getWasteTypeLabel(collection.waste_type).toLowerCase()} • {collection.time}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${
                    getOverallProgress() === 100 ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                  }`}>
                    {getOverallProgress() === 100 ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {getOverallProgress()}% completado
                  </span>
                </div>

                {/* Progress Line and Steps */}
                <div className="relative">
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-border"></div>
                  <div
                    className="absolute left-7 top-0 w-0.5 gradient-primary transition-all duration-1000"
                    style={{ height: `${getOverallProgress()}%` }}
                  ></div>

                  <div className="space-y-8">
                    {steps.map((step, index) => {
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
                                  {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-success" />}
                                  {step.status === 'in_progress' && <Clock className="w-4 h-4 text-accent animate-pulse" />}
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
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay recolección seleccionada</p>
                <p className="text-sm">Selecciona una recolección de la lista o programa una nueva</p>
                <Button onClick={() => navigate('/programar-recoleccion')} className="mt-4 gradient-primary">
                  Ir a Recolecciones
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Historial de Recolecciones</h2>
              <Button onClick={() => navigate('/programar-recoleccion')} className="gradient-primary">
                <Calendar className="w-4 h-4 mr-2" />
                Nueva Recolección
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : collections.length > 0 ? (
              <div className="space-y-4">
                {collections.map((col) => (
                  <Card
                    key={col.id}
                    onClick={() => selectCollection(col)}
                    className={`p-5 border-2 transition-smooth hover-lift cursor-pointer ${
                      collection?.id === col.id ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          col.status === 'completed' ? 'bg-success/10' : 'bg-accent/10'
                        }`}>
                          <Package className={`w-6 h-6 ${
                            col.status === 'completed' ? 'text-success' : 'text-accent'
                          }`} />
                        </div>
                        <div>
                          <div className="font-bold">
                            {new Date(col.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-sm text-muted-foreground">{col.time}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div>
                          <div className="text-muted-foreground">Peso</div>
                          <div className="font-medium">{col.estimated_weight} kg</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tipo</div>
                          <div className="font-medium">{getWasteTypeLabel(col.waste_type)}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          col.status === 'completed' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {getStatusLabel(col.status)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCollection(col);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Trazabilidad
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay recolecciones registradas</p>
                <p className="text-sm">Programa tu primera recolección para ver la trazabilidad</p>
                <Button onClick={() => navigate('/programar-recoleccion')} className="mt-4 gradient-primary">
                  Programar Recolección
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrazabilidadView;
