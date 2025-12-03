export interface Municipio {
  id: string;
  nombre: string;
  restaurantes: number;
  mercados: number;
  puntosRecoleccion: number;
  estado: 'activo' | 'proximo';
  proximaRecoleccion: string;
  coordinador: string;
  telefono: string;
}

export interface PuntoAcopio {
  id: string;
  nombre: string;
  tipo: 'acopio' | 'transformacion' | 'destino_final';
  direccion: string;
  capacidad: string;
  estado: 'activo' | 'inactivo';
  coordenadas?: { lat: number; lng: number };
}

export interface Ruta {
  id: string;
  nombre: string;
  codigo: string;
  vehiculo: string;
  conductor: string;
  paradas: number;
  distancia: string;
  duracion: string;
  estado: 'en_progreso' | 'programada' | 'completada';
  progreso: number;
  proximaParada: string;
}

export interface EstadisticaMapa {
  municipiosActivos: number;
  puntosRecoleccion: number;
  vehiculosEnRuta: number;
  kmRecorridos: number;
}

export class MapaTrazabilidadModel {
  private municipios: Municipio[] = [];
  private puntosAcopio: PuntoAcopio[] = [];
  private rutas: Ruta[] = [];
  private estadisticas: EstadisticaMapa = {
    municipiosActivos: 0,
    puntosRecoleccion: 0,
    vehiculosEnRuta: 0,
    kmRecorridos: 0
  };

  getMunicipios(): Municipio[] {
    return this.municipios;
  }

  setMunicipios(municipios: Municipio[]): void {
    this.municipios = municipios;
  }

  getPuntosAcopio(): PuntoAcopio[] {
    return this.puntosAcopio;
  }

  setPuntosAcopio(puntos: PuntoAcopio[]): void {
    this.puntosAcopio = puntos;
  }

  getRutas(): Ruta[] {
    return this.rutas;
  }

  setRutas(rutas: Ruta[]): void {
    this.rutas = rutas;
  }

  getEstadisticas(): EstadisticaMapa {
    return this.estadisticas;
  }

  setEstadisticas(stats: EstadisticaMapa): void {
    this.estadisticas = stats;
  }

  agregarMunicipio(municipio: Municipio): void {
    this.municipios.push(municipio);
  }

  agregarPuntoAcopio(punto: PuntoAcopio): void {
    this.puntosAcopio.push(punto);
  }

  agregarRuta(ruta: Ruta): void {
    this.rutas.push(ruta);
  }
}
