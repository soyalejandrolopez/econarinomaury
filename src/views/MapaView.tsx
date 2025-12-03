import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMapaController } from '@/controllers/MapaController';
import {
  MapPin,
  Truck,
  Factory,
  TreePine,
  ArrowRight,
  Clock,
  CheckCircle2,
  Recycle,
  Navigation2,
  Route,
  Target,
  BarChart3,
  Loader2,
  RefreshCw,
  Users
} from 'lucide-react';

const MapaView = () => {
  const {
    state,
    loadAllData,
    getCityLabel,
    getRouteStatusLabel,
    getActiveRoutesCount
  } = useMapaController();

  const stats = [
    { label: 'Municipios Activos', value: state.estadisticas.municipiosActivos.toString(), icon: MapPin, color: 'text-primary' },
    { label: 'Usuarios Registrados', value: state.estadisticas.totalUsers.toString(), icon: Users, color: 'text-secondary' },
    { label: 'Recolecciones Hoy', value: state.estadisticas.vehiculosEnRuta.toString(), icon: Truck, color: 'text-accent' },
    { label: 'Kg Recolectados', value: Math.round(state.estadisticas.totalWasteCollected).toLocaleString(), icon: Recycle, color: 'text-success' }
  ];

  const maxWaste = Math.max(...state.municipios.map(m => m.totalWaste), 1);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
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
          <Button
            variant="outline"
            onClick={() => loadAllData()}
            className="hover-lift"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
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
                <div className="text-2xl font-bold">
                  {state.initialLoading ? '...' : stat.value}
                </div>
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

                {state.initialLoading ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="relative h-[400px] rounded-xl bg-gradient-to-br from-muted/50 to-muted border-2 border-border overflow-hidden">
                    {/* Map Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-1/3 w-48 h-32 border-2 border-secondary/50 rounded-full transform -rotate-12"></div>
                      <div className="absolute top-1/2 left-1/2 w-64 h-40 border-2 border-primary/50 rounded-full transform rotate-6"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-40 h-28 border-2 border-accent/50 rounded-full"></div>
                    </div>

                    {/* Dynamic Location Markers based on data */}
                    {state.municipios.slice(0, 6).map((mun, index) => {
                      const positions = [
                        { top: '30%', left: '40%', size: 'w-8 h-8' },
                        { top: '60%', left: '20%', size: 'w-6 h-6' },
                        { top: '25%', left: '65%', size: 'w-6 h-6' },
                        { top: '45%', left: '55%', size: 'w-5 h-5' },
                        { top: '55%', left: '45%', size: 'w-5 h-5' },
                        { top: '70%', left: '60%', size: 'w-4 h-4' }
                      ];
                      const pos = positions[index] || positions[0];
                      const colors = ['gradient-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-info', 'bg-warning'];

                      return (
                        <div
                          key={mun.id}
                          className="absolute group cursor-pointer"
                          style={{ top: pos.top, left: pos.left }}
                        >
                          <div className={`${pos.size} rounded-full ${colors[index]} flex items-center justify-center shadow-medium ${index === 0 ? 'animate-pulse shadow-glow' : ''}`}>
                            <MapPin className={`${index < 2 ? 'w-4 h-4' : 'w-3 h-3'} text-primary-foreground`} />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-smooth z-20">
                            <div className="bg-card px-3 py-2 rounded-lg shadow-medium border text-sm whitespace-nowrap">
                              <div className="font-bold">{mun.name}</div>
                              <div className="text-xs text-muted-foreground">{mun.userCount} usuarios • {Math.round(mun.totalWaste)} kg</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Routes SVG */}
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
                )}
              </div>
            </Card>

            {/* Municipality List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Municipios con Cobertura</h2>
              {state.initialLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : state.municipios.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {state.municipios.map((mun) => (
                    <Card
                      key={mun.id}
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
                            {mun.status === 'active' && mun.nextCollection ? (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {mun.nextCollection}
                              </div>
                            ) : mun.status === 'coming_soon' ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Próximamente
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sin recolecciones programadas</span>
                            )}
                          </div>
                        </div>
                        {mun.status === 'active' && (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        )}
                      </div>
                      {mun.status === 'active' && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{mun.userCount}</div>
                              <div className="text-muted-foreground">Usuarios</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{Math.round(mun.totalWaste)}</div>
                              <div className="text-muted-foreground">kg</div>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <div className="font-bold text-sm">{mun.collectionPoints}</div>
                              <div className="text-muted-foreground">Puntos</div>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full gradient-primary rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((mun.totalWaste / maxWaste) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay municipios registrados</p>
                </div>
              )}
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
                  {getActiveRoutesCount()} rutas activas
                </span>
              </div>
            </div>

            {state.initialLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : state.rutas.length > 0 ? (
              <div className="space-y-4">
                {state.rutas.map((route) => (
                  <Card
                    key={route.id}
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
                            Código: {route.code} • Ciudad: {route.city}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        route.status === 'in_progress' ? 'bg-accent/10 text-accent' :
                        route.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {getRouteStatusLabel(route.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-muted-foreground">Paradas</div>
                        <div className="font-medium">{route.stops} puntos</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fecha</div>
                        <div className="font-medium">{new Date(route.date).toLocaleDateString('es-ES')}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Progreso</div>
                        <div className="font-medium">{route.progress}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Estado</div>
                        <div className="font-medium">{getRouteStatusLabel(route.status)}</div>
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
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay rutas programadas para hoy</p>
                <p className="text-sm">Las rutas aparecerán cuando haya recolecciones programadas</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="points">
          {state.initialLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : state.puntosAcopio.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {state.puntosAcopio.map((point) => {
                  const typeConfig = {
                    acopio: { icon: Factory, color: 'bg-secondary' },
                    transformacion: { icon: Recycle, color: 'bg-primary' },
                    destino_final: { icon: TreePine, color: 'bg-success' }
                  };
                  const config = typeConfig[point.type] || typeConfig.acopio;
                  const IconComponent = config.icon;

                  return (
                    <Card key={point.id} className="p-6 shadow-medium hover-lift border-2 border-transparent hover:border-primary/20">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl ${config.color} flex items-center justify-center shadow-medium`}>
                          <IconComponent className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{point.name}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                                {point.type.replace('_', ' ')}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              point.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                            }`}>
                              {point.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                              {point.status === 'active' ? 'Activo' : 'Inactivo'}
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
                    </Card>
                  );
                })}
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
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay puntos de acopio registrados</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapaView;
