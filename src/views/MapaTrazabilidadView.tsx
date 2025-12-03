import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  MapPin,
  Factory,
  Truck,
  Recycle,
  TreePine,
  Navigation2,
  Route,
  Target,
  Clock,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { Municipio, PuntoAcopio, Ruta, EstadisticaMapa } from '../models/MapaTrazabilidadModel';

interface MapaTrazabilidadViewProps {
  municipios: Municipio[];
  puntosAcopio: PuntoAcopio[];
  rutas: Ruta[];
  estadisticas: EstadisticaMapa;
}

export const MapaTrazabilidadView = ({
  municipios,
  puntosAcopio,
  rutas,
  estadisticas
}: MapaTrazabilidadViewProps) => {
  const getIconoPunto = (tipo: string) => {
    switch (tipo) {
      case 'acopio': return Factory;
      case 'transformacion': return Recycle;
      case 'destino_final': return TreePine;
      default: return Factory;
    }
  };

  const getColorPunto = (tipo: string) => {
    switch (tipo) {
      case 'acopio': return 'bg-secondary';
      case 'transformacion': return 'bg-primary';
      case 'destino_final': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getEstadoRutaIcon = (estado: string) => {
    switch (estado) {
      case 'completada': return CheckCircle2;
      case 'en_progreso': return Truck;
      default: return Clock;
    }
  };

  const stats = [
    { label: 'Municipios Activos', value: estadisticas.municipiosActivos, icon: MapPin, color: 'text-primary' },
    { label: 'Puntos de Recolección', value: estadisticas.puntosRecoleccion, icon: Target, color: 'text-secondary' },
    { label: 'Vehículos en Ruta', value: estadisticas.vehiculosEnRuta, icon: Truck, color: 'text-accent' },
    { label: 'Km Recorridos Hoy', value: estadisticas.kmRecorridos, icon: Route, color: 'text-success' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Navigation2 className="w-4 h-4" />
              <span className="text-sm font-medium">Red de Trazabilidad</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Mapa de Trazabilidad</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Sistema de seguimiento y trazabilidad de residuos orgánicos en Nariño.
            </p>
          </div>

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

          <Tabs defaultValue="municipios" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="municipios">
                <MapPin className="w-4 h-4 mr-2" />
                Municipios
              </TabsTrigger>
              <TabsTrigger value="rutas">
                <Route className="w-4 h-4 mr-2" />
                Rutas
              </TabsTrigger>
              <TabsTrigger value="puntos">
                <Target className="w-4 h-4 mr-2" />
                Puntos de Acopio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="municipios">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {municipios.map((municipio) => (
                  <Card key={municipio.id} className="p-6 hover-lift shadow-medium">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold">{municipio.nombre}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        municipio.estado === 'activo' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {municipio.estado === 'activo' ? 'Activo' : 'Próximo'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Restaurantes:</span>
                        <span className="font-semibold">{municipio.restaurantes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mercados:</span>
                        <span className="font-semibold">{municipio.mercados}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Puntos:</span>
                        <span className="font-semibold">{municipio.puntosRecoleccion}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{municipio.proximaRecoleccion}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{municipio.telefono}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rutas">
              <div className="space-y-4">
                {rutas.map((ruta) => {
                  const IconoEstado = getEstadoRutaIcon(ruta.estado);
                  return (
                    <Card key={ruta.id} className="p-6 hover-lift shadow-medium">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{ruta.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{ruta.codigo}</p>
                        </div>
                        <IconoEstado className="w-6 h-6 text-primary" />
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Vehículo</p>
                          <p className="font-semibold">{ruta.vehiculo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conductor</p>
                          <p className="font-semibold">{ruta.conductor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Paradas</p>
                          <p className="font-semibold">{ruta.paradas}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Distancia</p>
                          <p className="font-semibold">{ruta.distancia}</p>
                        </div>
                      </div>
                      {ruta.estado === 'en_progreso' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{ruta.progreso}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${ruta.progreso}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="puntos">
              <div className="grid md:grid-cols-2 gap-4">
                {puntosAcopio.map((punto) => {
                  const Icono = getIconoPunto(punto.tipo);
                  const colorClass = getColorPunto(punto.tipo);
                  return (
                    <Card key={punto.id} className="p-6 hover-lift shadow-medium">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                          <Icono className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{punto.nombre}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{punto.direccion}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Capacidad:</span>
                            <span className="font-semibold">{punto.capacidad}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
