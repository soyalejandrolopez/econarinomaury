import { MapaTrazabilidadModel, Municipio, PuntoAcopio, Ruta, EstadisticaMapa } from '../models/MapaTrazabilidadModel';

export class MapaTrazabilidadController {
  private model: MapaTrazabilidadModel;

  constructor() {
    this.model = new MapaTrazabilidadModel();
  }

  cargarMunicipios(municipios: Municipio[]): void {
    this.model.setMunicipios(municipios);
  }

  cargarPuntosAcopio(puntos: PuntoAcopio[]): void {
    this.model.setPuntosAcopio(puntos);
  }

  cargarRutas(rutas: Ruta[]): void {
    this.model.setRutas(rutas);
  }

  cargarEstadisticas(stats: EstadisticaMapa): void {
    this.model.setEstadisticas(stats);
  }

  obtenerMunicipios(): Municipio[] {
    return this.model.getMunicipios();
  }

  obtenerPuntosAcopio(): PuntoAcopio[] {
    return this.model.getPuntosAcopio();
  }

  obtenerRutas(): Ruta[] {
    return this.model.getRutas();
  }

  obtenerEstadisticas(): EstadisticaMapa {
    return this.model.getEstadisticas();
  }

  filtrarMunicipiosPorEstado(estado: 'activo' | 'proximo'): Municipio[] {
    return this.model.getMunicipios().filter(m => m.estado === estado);
  }

  filtrarRutasPorEstado(estado: 'en_progreso' | 'programada' | 'completada'): Ruta[] {
    return this.model.getRutas().filter(r => r.estado === estado);
  }

  obtenerPuntoAcopioPorId(id: string): PuntoAcopio | undefined {
    return this.model.getPuntosAcopio().find(p => p.id === id);
  }

  obtenerMunicipioPorId(id: string): Municipio | undefined {
    return this.model.getMunicipios().find(m => m.id === id);
  }
}
