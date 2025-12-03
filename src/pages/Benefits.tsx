import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Leaf, TrendingDown, Users, Award, DollarSign, Sparkles, Target, Building2 } from 'lucide-react';
import restaurantRecycling from '@/assets/restaurant-recycling.jpg';

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: 'Impacto Ambiental Positivo',
      description: 'Reduce significativamente la huella de carbono de tu establecimiento evitando que los residuos lleguen a rellenos sanitarios.',
      stats: '- 80% emisiones CO₂',
      color: 'bg-success/10 text-success',
    },
    {
      icon: DollarSign,
      title: 'Ahorro Económico',
      description: 'Disminuye costos de recolección de basura y convierte residuos en ingresos al venderlos a centros de aprovechamiento.',
      stats: 'Hasta $500k/mes de ahorro',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Award,
      title: 'Certificación Sostenible',
      description: 'Obtén el certificado "Establecimiento Responsable con los ODS" que mejora tu reputación y atrae clientes conscientes.',
      stats: '+35% preferencia clientes',
      color: 'bg-warning/10 text-warning',
    },
    {
      icon: TrendingDown,
      title: 'Reducción de Desperdicios',
      description: 'Optimiza procesos internos y reduce el desperdicio de alimentos hasta en un 40% con nuestro sistema de monitoreo.',
      stats: '40% menos desperdicio',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Users,
      title: 'Generación de Empleos',
      description: 'Contribuye a crear empleos verdes en tu comunidad: recolectores, transformadores y gestores ambientales.',
      stats: '120+ empleos creados',
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: Sparkles,
      title: 'Economía Circular',
      description: 'Forma parte de un sistema donde tus residuos se convierten en recursos para granjas, compostaje y energía renovable.',
      stats: '100% aprovechamiento',
      color: 'bg-info/10 text-info',
    },
    {
      icon: Target,
      title: 'Cumplimiento Normativo',
      description: 'Anticípate a futuras regulaciones sobre gestión de residuos y demuestra compromiso con la sostenibilidad.',
      stats: 'Cumplimiento total ODS',
      color: 'bg-destructive/10 text-destructive',
    },
    {
      icon: Building2,
      title: 'Ventaja Competitiva',
      description: 'Diferénciate de la competencia con un compromiso real y verificable con el medio ambiente.',
      stats: 'Sello verde oficial',
      color: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-gradient">Ventajas y Beneficios</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Descubre cómo EcoNariño transforma tu gestión de residuos en oportunidades reales de negocio y sostenibilidad
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 gradient-hero opacity-10 rounded-3xl"></div>
            <img
              src={restaurantRecycling}
              alt="Separación de residuos en restaurante"
              className="w-full h-96 object-cover rounded-3xl shadow-strong"
            />
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover-lift shadow-medium border-2 hover:border-primary/20 transition-smooth"
              >
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{benefit.description}</p>
                <div className="pt-4 border-t border-border">
                  <span className="text-sm font-semibold text-primary">{benefit.stats}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Case Study Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <Card className="p-8 shadow-strong">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-2xl font-bold">Caso de Éxito</h3>
              </div>
              <h4 className="text-xl font-bold mb-4 text-primary">Restaurante El Buen Sabor - Pasto</h4>
              <p className="text-muted-foreground mb-6">
                Después de 6 meses usando EcoNariño, este restaurante logró:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-success">✓</span>
                  </div>
                  <span>Reducir costos de basura en <strong>$380,000 COP/mes</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-success">✓</span>
                  </div>
                  <span>Evitar <strong>2.4 toneladas de CO₂</strong> en el ambiente</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-success">✓</span>
                  </div>
                  <span>Aumentar clientes en <strong>28%</strong> por certificación verde</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-success">✓</span>
                  </div>
                  <span>Generar <strong>ingresos adicionales</strong> vendiendo compost</span>
                </li>
              </ul>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 gradient-primary text-primary-foreground">
                <h3 className="text-2xl font-bold mb-4">Para Restaurantes</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Mejora imagen corporativa</li>
                  <li>✓ Reduce costos operativos</li>
                  <li>✓ Atrae clientes eco-conscientes</li>
                  <li>✓ Cumple regulaciones ambientales</li>
                </ul>
              </Card>

              <Card className="p-6 gradient-secondary text-primary-foreground">
                <h3 className="text-2xl font-bold mb-4">Para Plazas de Mercado</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Solución integral de residuos</li>
                  <li>✓ Reduce problemas de plagas</li>
                  <li>✓ Mejora condiciones sanitarias</li>
                  <li>✓ Genera valor de desechos</li>
                </ul>
              </Card>

              <Card className="p-6 bg-accent/10 text-accent-foreground border-accent/20">
                <h3 className="text-2xl font-bold mb-4">Para Granjas</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Alimento animal de calidad</li>
                  <li>✓ Compost para cultivos</li>
                  <li>✓ Reducción costos insumos</li>
                  <li>✓ Producción más sostenible</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <Card className="p-12 text-center shadow-strong gradient-hero text-primary-foreground">
            <h2 className="text-4xl font-bold mb-6">
              Transforma tus Residuos en Ventajas Competitivas
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Únete a los más de 300 establecimientos que ya están mejorando su rentabilidad y su impacto ambiental con EcoNariño
            </p>
            <div className="flex justify-center gap-4">
              <a href="/registro" className="inline-block">
                <button className="px-8 py-4 bg-primary-foreground text-primary rounded-lg font-bold hover-lift shadow-strong text-lg">
                  Comenzar Ahora
                </button>
              </a>
              <a href="/como-funciona" className="inline-block">
                <button className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground rounded-lg font-bold hover-lift border-2 border-primary-foreground/30 text-lg">
                  Conocer Más
                </button>
              </a>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Benefits;
