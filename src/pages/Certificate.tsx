import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserData';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Download, ArrowLeft, Award, Loader2 } from 'lucide-react';

const Certificate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading } = useUserStats();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (typeof window !== 'undefined' && certificateRef.current) {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(certificateRef.current!).then((canvas) => {
          const link = document.createElement('a');
          link.download = `certificado-ods12-${user?.establishment}.png`;
          link.href = canvas.toDataURL();
          link.click();
        });
      });
    }
  };

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

          <Card ref={certificateRef} className="p-12 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center space-y-6">
              <Award className="w-24 h-24 mx-auto text-primary" />
              <h2 className="text-3xl font-bold">Certificado de Sostenibilidad</h2>
              <p className="text-lg">Se otorga a</p>
              <h3 className="text-4xl font-bold text-primary">{user?.establishment}</h3>
              <p className="text-lg">Por su compromiso con la economía circular y el aprovechamiento responsable de residuos orgánicos</p>
              
              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Cargando datos...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 py-8">
                  <div>
                    <p className="text-3xl font-bold text-primary">{Math.round(stats.wasteCollected)} kg</p>
                    <p className="text-sm text-muted-foreground">Residuos Aprovechados</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-secondary">{Math.round(stats.co2Reduced)} kg</p>
                    <p className="text-sm text-muted-foreground">CO₂ Reducido</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent">{stats.sustainabilityPoints.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Puntos Sostenibilidad</p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t">
                <p className="text-sm text-muted-foreground">Contribuyendo al ODS 12: Producción y Consumo Responsables</p>
                <p className="text-sm text-muted-foreground mt-2">EcoNariño Circular - {new Date().getFullYear()}</p>
              </div>
            </div>
          </Card>

          <div className="text-center mt-8">
            <Button onClick={handleDownload} size="lg" className="gradient-primary">
              <Download className="w-5 h-5 mr-2" />
              Descargar Certificado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
