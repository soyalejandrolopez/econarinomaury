import { useState, useEffect } from 'react';
import { MapaTrazabilidadController } from '../controllers/MapaTrazabilidadController';
import { MapaTrazabilidadView } from '../views/MapaTrazabilidadView';
import { Municipio, PuntoAcopio, Ruta, EstadisticaMapa } from '../models/MapaTrazabilidadModel';

const MapaTrazabilidad = () => {
  const [controller] = useState(() => new MapaTrazabilidadController());
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [puntosAcopio, setPuntosAcopio] = useState<PuntoAcopio[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaMapa>({
    municipiosActivos: 0,
    puntosRecoleccion: 0,
    vehiculosEnRuta: 0,
    kmRecorridos: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Aquí se cargarían los datos desde una API
    // Por ahora se inicializan vacíos
    const municipiosData: Municipio[] = [];
    const puntosData: PuntoAcopio[] = [];
    const rutasData: Ruta[] = [];
    const statsData: EstadisticaMapa = {
      municipiosActivos: 0,
      puntosRecoleccion: 0,
      vehiculosEnRuta: 0,
      kmRecorridos: 0
    };

    controller.cargarMunicipios(municipiosData);
    controller.cargarPuntosAcopio(puntosData);
    controller.cargarRutas(rutasData);
    controller.cargarEstadisticas(statsData);

    setMunicipios(controller.obtenerMunicipios());
    setPuntosAcopio(controller.obtenerPuntosAcopio());
    setRutas(controller.obtenerRutas());
    setEstadisticas(controller.obtenerEstadisticas());
  };

  return (
    <MapaTrazabilidadView
      municipios={municipios}
      puntosAcopio={puntosAcopio}
      rutas={rutas}
      estadisticas={estadisticas}
    />
  );
};

export default MapaTrazabilidad;
