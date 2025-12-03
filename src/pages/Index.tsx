import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, Leaf, Recycle, ArrowRight, BarChart3, Target, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-image.jpg';
import circularEconomy from '@/assets/circular-economy.jpg';
import dashboardPreview from '@/assets/dashboard-preview.jpg';
import restaurantRecycling from '@/assets/restaurant-recycling.jpg';

const Index = () => {
  const stats = [
    { icon: Users, label: 'Establecimientos', value: '300+', color: 'text-primary' },
    { icon: Recycle, label: 'Kg Aprovechados', value: '5,000', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Reducción Desperdicio', value: '40%', color: 'text-accent' },
    { icon: Award, label: 'Empleos Verdes', value: '120', color: 'text-success' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Registro Digital',
      description: 'Monitoreo en tiempo real de residuos generados por tipo y cantidad',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: BarChart3,
      title: 'Trazabilidad Total',
      description: 'Sistema completo de seguimiento desde la generación hasta el aprovechamiento',
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: Recycle,
      title: 'Economía Circular',
      description: 'Transformación de residuos en recursos productivos para granjas y compostaje',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Award,
      title: 'Certificación ODS',
      description: 'Reconocimiento como "Establecimiento Sostenible" comprometido con los ODS',
      color: 'bg-success/10 text-success',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transformando <span className="text-gradient">Residuos</span> en{' '}
                <span className="text-gradient">Oportunidades</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                La plataforma EcoNariño conecta restaurantes, plazas de mercado y centros de aprovechamiento para reducir el desperdicio de alimentos y promover la economía circular en el departamento de Nariño.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/registro">
                  <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-8">
                    Registrar Establecimiento
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/como-funciona">
                  <Button size="lg" variant="outline" className="hover-lift text-lg px-8">
                    Conoce Más
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-3xl"></div>
              <img
                src={heroImage}
                alt="Gestión sostenible de residuos"
                className="relative rounded-2xl shadow-strong w-full h-auto hover-scale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center hover-lift shadow-soft border-2 hover:border-primary/20 transition-smooth"
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is EcoNariño */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              ¿Qué es <span className="text-gradient">EcoNariño</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Una plataforma digital inteligente que gestiona y valoriza residuos orgánicos, conectando a generadores (restaurantes y plazas de mercado) con transformadores (centros de compostaje y granjas), creando un ecosistema de economía circular.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="order-2 md:order-1">
              <img
                src={circularEconomy}
                alt="Economía circular"
                className="rounded-2xl shadow-medium hover-scale"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold mb-4">Economía Circular en Acción</h3>
              <p className="text-muted-foreground mb-6">
                Nuestro sistema convierte un problema ambiental en una oportunidad económica. Los residuos orgánicos se transforman en:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <span><strong>Compost de calidad</strong> para agricultura sostenible</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                    <Recycle className="w-4 h-4 text-secondary" />
                  </div>
                  <span><strong>Alimento animal</strong> reduciendo costos de producción</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <span><strong>Empleos verdes</strong> en la cadena de aprovechamiento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-gradient">Características</span> Principales
            </h2>
            <p className="text-lg text-muted-foreground">
              Tecnología y sostenibilidad trabajando juntas para crear un futuro más limpio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover-lift shadow-soft border-2 hover:border-primary/20 transition-smooth"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient">Panel de Control</span> Inteligente
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Accede a métricas en tiempo real sobre tu impacto ambiental:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Residuos aprovechados por categoría</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Reducción de emisiones de CO₂</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span>Histórico y tendencias mensuales</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span>Certificados de sostenibilidad descargables</span>
                </li>
              </ul>
              <Link to="/registro">
                <Button size="lg" className="gradient-primary hover-lift">
                  Crear Cuenta Gratis
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 gradient-secondary opacity-20 blur-3xl rounded-3xl"></div>
              <img
                src={dashboardPreview}
                alt="Dashboard de EcoNariño"
                className="relative rounded-2xl shadow-strong hover-scale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Card className="p-12 text-center shadow-strong border-2 border-primary/20">
            <h2 className="text-4xl font-bold mb-6">
              Únete a la <span className="text-gradient">Revolución Verde</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Forma parte de la red de establecimientos comprometidos con el medio ambiente. Comienza hoy a transformar tus residuos en recursos valiosos.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/registro">
                <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-8">
                  Registrar Establecimiento
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="hover-lift text-lg px-8">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
