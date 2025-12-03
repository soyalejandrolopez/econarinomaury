import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  MapPin,
  Building2,
  Truck,
  Factory,
  TreePine,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Recycle,
  Calendar,
  Phone,
  Mail,
  Navigation2,
  Route,
  Target,
  Leaf,
  BarChart3
} from 'lucide-react';

const CollectionMap = () => {
  const municipalities = [
    {
      name: 'Pasto',
      restaurants: 85,
      markets: 12,
      collectionPoints: 5,
      status: 'active',
      nextCollection: 'Hoy 08:00 AM',
      coordinator: 'Juan Pérez',
      phone: '+57 316 XXX XXXX'
    },
    {
      name: 'Tumaco',
      restaurants: 45,
      markets: 8,
      collectionPoints: 3,
      status: 'active',
      nextCollection: 'Mañana 07:30 AM',
      coordinator: 'María García',
      phone: '+57 318 XXX XXXX'
    },
    {
      name: 'Ipiales',
      restaurants: 38,
      markets: 6,
      collectionPoints: 2,
      status: 'active',
      nextCollection: 'Vie 15 Nov',
      coordinator: 'Carlos López',
      phone: '+57 320 XXX XXXX'
    },
    {
      name: 'Túquerres',
      restaurants: 28,
      markets: 4,
      collectionPoints: 2,
      status: 'active',
      nextCollection: 'Sáb 16 Nov',
      coordinator: 'Ana Martínez',
      phone: '+57 315 XXX XXXX'
    },
    {
      name: 'La Unión',
      restaurants: 22,
      markets: 3,
      collectionPoints: 1,
      status: 'active',
      nextCollection: 'Lun 18 Nov',
      coordinator: 'Pedro Rojas',
      phone: '+57 312 XXX XXXX'
    },
    {
      name: 'Samaniego',
      restaurants: 18,
      markets: 2,
      collectionPoints: 1,
      status: 'coming_soon',
      nextCollection: 'Próximamente',
      coordinator: '-',
      phone: '-'
    }
  ];

  const collectionPoints = [
    {
      name: 'Centro de Acopio La Esperanza',
      type: 'Acopio',
      address: 'Cra 25 #18-42, Pasto',
      capacity: '500 kg/día',
      status: 'active',
      icon: Factory,
      color: 'bg-secondary'
    },
    {
      name: 'Planta de Compostaje EcoNariño',
      type: 'Transformación',
      address: 'Km 5 Vía Pasto-Chachagüí',
      capacity: '2,000 kg/día',
      status: 'active',
      icon: Recycle,
      color: 'bg-primary'
    },
    {
      name: 'Granja Orgánica Los Andes',
      type: 'Destino Final',
      address: 'Vereda San Fernando, Pasto',
      capacity: '300 kg/día',
      status: 'active',
      icon: TreePine,
      color: 'bg-success'
    },
    {
      name: 'Centro de Acopio Tumaco',
      type: 'Acopio',
      address: 'Calle 11 #4-56, Tumaco',
      capacity: '300 kg/día',
      status: 'active',
      icon: Factory,
      color: 'bg-secondary'
    }
  ];

  const routes = [
    {
      name: 'Ruta Norte - Pasto',
      code: 'RN-001',
      vehicle: 'EC-015',
      driver: 'José Hernández',
      stops: 25,
      distance: '45 km',
      duration: '4 horas',
      status: 'in_progress',
      progress: 60,
      nextStop: 'Restaurant La Casona'
    },
    {
      name: 'Ruta Centro - Pasto',
      code: 'RC-002',
      vehicle: 'EC-018',
      driver: 'Miguel Torres',
      stops: 32,
      distance: '38 km',
      duration: '5 horas',
      status: 'scheduled',
      progress: 0,
      nextStop: 'Plaza de Mercado El Potrerillo'
    },
    {
      name: 'Ruta Sur - Pasto',
      code: 'RS-003',
      vehicle: 'EC-021',
      driver: 'Roberto Díaz',
      stops: 18,
      distance: '28 km',
      duration: '3 horas',
      status: 'completed',
      progress: 100,
      nextStop: '-'
    }
  ];

  const stats = [
    { label: 'Municipios Activos', value: '12', icon: MapPin, color: 'text-primary' },
    { label: 'Puntos de Recolección', value: '45', icon: Target, color: 'text-secondary' },
    { label: 'Vehículos en Ruta', value: '8', icon: Truck, color: 'text-accent' },
    { label: 'Km Recorridos Hoy', value: '320', icon: Route, color: 'text-success' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Navigation2 className="w-4 h-4" />
              <span className="text-sm font-medium">Red de Recolección</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Mapa de Recolección</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Conoce nuestra red logística de recolección que conecta generadores con centros de
              aprovechamiento en todo el departamento de Nariño.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 hover-lift shadow-medium">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="map" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Cobertura
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                Rutas Activas
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Puntos de Acopio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Map Visualization */}
                <Card className="md:col-span-2 p-6 shadow-medium min-h-[500px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-pattern-grid opacity-30"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-6">Departamento de Nariño</h2>

                    {/* Simulated Map */}
                    <div className="relative h-[400px] rounded-xl bg-gradient-to-br from-muted/50 to-muted border-2 border-border overflow-hidden">
                      {/* Map Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/3 w-48 h-32 border-2 border-secondary/50 rounded-full transform -rotate-12"></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-40 border-2 border-primary/50 rounded-full transform rotate-6"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-40 h-28 border-2 border-accent/50 rounded-full"></div>
                      </div>

                      {/* Location Markers */}
                      <div className="absolute top-[30%] left-[40%] group cursor-pointer">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse">
                          <MapPin className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth">
                          <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                            <div className="font-bold">Pasto</div>
                            <div className="text-xs text-muted-foreground">85 restaurantes</div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[60%] left-[20%] group cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-medium">
                          <MapPin className="w-3 h-3 text-secondary-foreground" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth">
                          <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                            <div className="font-bold">Tumaco</div>
                            <div className="text-xs text-muted-foreground">45 restaurantes</div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[25%] left-[65%] group cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-medium">
                          <MapPin className="w-3 h-3 text-accent-foreground" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth">
                          <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                            <div className="font-bold">Ipiales</div>
                            <div className="text-xs text-muted-foreground">38 restaurantes</div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[45%] left-[55%] group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-medium">
                          <MapPin className="w-2.5 h-2.5 text-success-foreground" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth">
                          <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                            <div className="font-bold">Túquerres</div>
                            <div className="text-xs text-muted-foreground">28 restaurantes</div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[55%] left-[45%] group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-info flex items-center justify-center shadow-medium">
                          <MapPin className="w-2.5 h-2.5 text-info-foreground" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth">
                          <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                            <div className="font-bold">La Unión</div>
                            <div className="text-xs text-muted-foreground">22 restaurantes</div>
                          </div>
                        </div>
                      </div>

                      {/* Routes */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <path
                          d="M 160 120 Q 200 180 80 240"
                          stroke="hsl(var(--secondary))"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          fill="none"
                          opacity="0.5"
                        />
                        <path
                          d="M 160 120 Q 220 100 260 100"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          fill="none"
                          opacity="0.5"
                        />
                        <path
                          d="M 160 120 Q 190 160 220 180"
                          stroke="hsl(var(--accent))"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          fill="none"
                          opacity="0.5"
                        />
                      </svg>

                      {/* Legend */}
                      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border shadow-medium">
                        <div className="text-xs font-medium mb-2">Leyenda</div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full gradient-primary"></div>
                            <span>Ciudad principal</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            <span>Municipio activo</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-8 h-0.5 border-t-2 border-dashed border-primary/50"></div>
                            <span>Rutas de recolección</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Municipality List */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Municipios con Cobertura</h2>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {municipalities.map((mun, index) => (
                      <Card
                        key={index}
                        className={`p-4 hover-lift transition-smooth cursor-pointer border-2 ${
                          mun.status === 'coming_soon' ? 'opacity-60 border-dashed' : 'border-transparent hover:border-primary/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              mun.status === 'active' ? 'gradient-primary' : 'bg-muted'
                            }`}>
                              <MapPin className={`w-5 h-5 ${
                                mun.status === 'active' ? 'text-primary-foreground' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div>
                              <div className="font-bold">{mun.name}</div>
                              {mun.status === 'active' ? (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {mun.nextCollection}
                                </div>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  Próximamente
                                </span>
                              )}
                            </div>
                          </div>
                          {mun.status === 'active' && (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          )}
                        </div>
                        {mun.status === 'active' && (
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{mun.restaurants}</div>
                              <div className="text-muted-foreground">Restaurantes</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{mun.markets}</div>
                              <div className="text-muted-foreground">Mercados</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{mun.collectionPoints}</div>
                              <div className="text-muted-foreground">Acopios</div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="routes">
              <Card className="p-6 shadow-medium">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Rutas de Recolección Hoy</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                      3 rutas activas
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {routes.map((route, index) => (
                    <Card
                      key={index}
                      className={`p-5 border-2 transition-smooth ${
                        route.status === 'in_progress' ? 'border-accent/30 bg-accent/5' :
                        route.status === 'completed' ? 'border-success/30 bg-success/5' :
                        'border-border'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            route.status === 'in_progress' ? 'gradient-warm animate-pulse' :
                            route.status === 'completed' ? 'bg-success' :
                            'bg-muted'
                          }`}>
                            <Truck className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{route.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Vehículo: {route.vehicle} • Conductor: {route.driver}
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          route.status === 'in_progress' ? 'bg-accent/10 text-accent' :
                          route.status === 'completed' ? 'bg-success/10 text-success' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {route.status === 'in_progress' ? 'En progreso' :
                           route.status === 'completed' ? 'Completada' : 'Programada'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground">Paradas</div>
                          <div className="font-medium">{route.stops} puntos</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Distancia</div>
                          <div className="font-medium">{route.distance}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Duración</div>
                          <div className="font-medium">{route.duration}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Progreso</div>
                          <div className="font-medium">{route.progress}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Próxima parada</div>
                          <div className="font-medium truncate">{route.nextStop}</div>
                        </div>
                      </div>

                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            route.status === 'completed' ? 'bg-success' : 'gradient-warm'
                          }`}
                          style={{ width: `${route.progress}%` }}
                        ></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="points">
              <div className="grid md:grid-cols-2 gap-6">
                {collectionPoints.map((point, index) => (
                  <Card key={index} className="p-6 shadow-medium hover-lift border-2 border-transparent hover:border-primary/20">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl ${point.color} flex items-center justify-center shadow-medium`}>
                        <point.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{point.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">{point.type}</span>
                          </div>
                          <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {point.address}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BarChart3 className="w-4 h-4" />
                        Capacidad: {point.capacity}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Contactar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Navigation2 className="w-4 h-4 mr-2" />
                        Cómo llegar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Join Network CTA */}
              <Card className="mt-8 p-8 shadow-medium gradient-hero text-primary-foreground relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold mb-4">¿Quieres ser un punto de acopio?</h3>
                  <p className="mb-6 opacity-90 max-w-xl mx-auto">
                    Únete a nuestra red de centros de aprovechamiento y contribuye a la economía circular de Nariño.
                    Recibe residuos orgánicos y transfórmalos en recursos valiosos.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">
                      Registrarse como Centro
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10">
                      Más información
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollectionMap;
