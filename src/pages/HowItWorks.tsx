import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { UserPlus, ClipboardCheck, Truck, Leaf, BarChart3, Award } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: '1. Registro',
      description: 'Los establecimientos se registran en la plataforma indicando tipo, ubicación y volumen estimado de residuos.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: ClipboardCheck,
      title: '2. Clasificación',
      description: 'El sistema categoriza los residuos por tipo (compostables, alimento animal, etc.) y programa recolecciones.',
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: Truck,
      title: '3. Logística Optimizada',
      description: 'Rutas eficientes conectan generadores con centros de aprovechamiento, reduciendo costos y emisiones.',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Leaf,
      title: '4. Transformación',
      description: 'Los residuos se convierten en compost, alimento animal o biogás en centros especializados.',
      color: 'bg-success/10 text-success',
    },
    {
      icon: BarChart3,
      title: '5. Trazabilidad',
      description: 'Cada paso queda registrado digitalmente, permitiendo seguimiento en tiempo real del impacto.',
      color: 'bg-info/10 text-info',
    },
    {
      icon: Award,
      title: '6. Certificación',
      description: 'Los participantes reciben certificados de sostenibilidad y reconocimiento por su contribución a los ODS.',
      color: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              ¿Cómo Funciona <span className="text-gradient">EcoNariño</span>?
            </h1>
            <p className="text-xl text-muted-foreground">
              Un proceso simple y efectivo que transforma residuos en recursos valiosos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="p-8 hover-lift shadow-medium border-2 hover:border-primary/20 transition-smooth relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full"></div>
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 relative z-10`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-12 shadow-strong gradient-hero text-primary-foreground">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">El Ciclo Completo</h2>
              <p className="text-lg opacity-90 mb-8">
                EcoNariño crea un ecosistema cerrado donde cada residuo tiene un destino productivo. Desde el momento en que un restaurante separa sus desechos hasta que se convierten en abono para cultivos locales, cada paso está digitalizado, rastreado y optimizado para máxima eficiencia.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-primary-foreground/10 rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-sm opacity-90">Trazabilidad Digital</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">30%</div>
                  <div className="text-sm opacity-90">Reducción de Costos</div>
                </div>
                <div className="bg-primary-foreground/10 rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">0</div>
                  <div className="text-sm opacity-90">Residuos a Rellenos</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;
