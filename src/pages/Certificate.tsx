import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { supabase } from '@/lib/supabase';
import { Download, ArrowLeft, Award, Loader2, Leaf, Recycle, Star } from 'lucide-react';

interface CertificateStats {
  totalWaste: number;
  co2Reduced: number;
  economicSavings: number;
  points: number;
  collectionsCount: number;
}

const Certificate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<CertificateStats>({
    totalWaste: 0,
    co2Reduced: 0,
    economicSavings: 0,
    points: 0,
    collectionsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Cargar estadísticas directamente de collections
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        // Obtener todas las recolecciones del usuario
        const { data: collections, error } = await supabase
          .from('collections')
          .select('estimated_weight, status, traceability_step')
          .eq('user_id', user.id);

        if (error) throw error;

        if (collections && collections.length > 0) {
          // Calcular totales
          const totalWaste = collections.reduce((sum, col) => {
            return sum + (Number(col.estimated_weight) || 0);
          }, 0);

          // CO2 reducido: 0.5 kg CO2 por cada kg de residuos
          const co2Reduced = totalWaste * 0.5;

          // Ahorro económico: 380 COP por kg
          const economicSavings = totalWaste * 380;

          // Puntos: 1.5 puntos por kg
          const points = Math.round(totalWaste * 1.5);

          setStats({
            totalWaste,
            co2Reduced,
            economicSavings,
            points,
            collectionsCount: collections.length
          });
        }
      } catch (error) {
        console.error('Error loading certificate stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id]);

  const handleDownload = () => {
    if (typeof window !== 'undefined' && certificateRef.current) {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(certificateRef.current!, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        }).then((canvas) => {
          const link = document.createElement('a');
          link.download = `certificado-ods12-${user?.establishment || 'econarino'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Certificado ODS 12</h1>
            <p className="text-muted-foreground">Producción y Consumo Responsables</p>
          </div>

          <Card ref={certificateRef} className="p-12 bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-4 border-primary/20">
            <div className="text-center space-y-6">
              {/* Logo y encabezado */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <Award className="w-14 h-14 text-primary-foreground" />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-primary">Certificado de Sostenibilidad</h2>
                <p className="text-muted-foreground mt-2">EcoNariño Circular</p>
              </div>

              <div className="py-4">
                <p className="text-lg text-muted-foreground">Se otorga el presente certificado a</p>
                <h3 className="text-4xl font-bold text-primary mt-2">{user?.establishment || 'Establecimiento'}</h3>
                <p className="text-muted-foreground mt-1">{user?.name}</p>
              </div>

              <p className="text-lg max-w-xl mx-auto">
                Por su compromiso con la economía circular y el aprovechamiento responsable de residuos orgánicos en el departamento de Nariño
              </p>

              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Calculando estadísticas...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 py-8 border-y border-primary/20">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Recycle className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{Math.round(stats.totalWaste)}</p>
                    <p className="text-sm text-muted-foreground">kg Aprovechados</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                      <Leaf className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="text-3xl font-bold text-secondary">{Math.round(stats.co2Reduced)}</p>
                    <p className="text-sm text-muted-foreground">kg CO₂ Evitado</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-accent">{stats.points.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Puntos Sostenibilidad</p>
                  </div>
                </div>
              )}

              <div className="pt-6 space-y-2">
                <p className="text-sm font-medium">Contribuyendo al ODS 12: Producción y Consumo Responsables</p>
                <p className="text-sm text-muted-foreground">
                  Basado en {stats.collectionsCount} recolecciones registradas
                </p>
                <p className="text-sm text-muted-foreground">
                  Fecha de emisión: {currentDate}
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-8 text-xs text-muted-foreground">
                <span>EcoNariño Circular © {new Date().getFullYear()}</span>
                <span>•</span>
                <span>Nariño, Colombia</span>
              </div>
            </div>
          </Card>

          <div className="text-center mt-8 space-y-4">
            <Button onClick={handleDownload} size="lg" className="gradient-primary">
              <Download className="w-5 h-5 mr-2" />
              Descargar Certificado
            </Button>
            <p className="text-sm text-muted-foreground">
              El certificado se descargará como imagen PNG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
