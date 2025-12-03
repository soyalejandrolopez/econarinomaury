import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Users,
  Leaf,
  Recycle,
  ArrowRight,
  BarChart3,
  Target,
  Award,
  Truck,
  Building2,
  TreePine,
  Factory,
  MapPin,
  CheckCircle2,
  Sparkles,
  Globe,
  Heart,
  Zap,
  Shield,
  PieChart,
  LineChart,
  ArrowDown,
  Play,
  Star
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-image.jpg';
import circularEconomy from '@/assets/circular-economy.jpg';
import dashboardPreview from '@/assets/dashboard-preview.jpg';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { icon: Users, label: 'Establecimientos Conectados', value: '300+', color: 'bg-primary text-primary-foreground', description: 'Restaurantes y plazas de mercado' },
    { icon: Recycle, label: 'Kg Aprovechados', value: '5,000', color: 'bg-secondary text-secondary-foreground', description: 'Residuos transformados' },
    { icon: TrendingUp, label: 'Reducción de Desperdicio', value: '40%', color: 'bg-accent text-accent-foreground', description: 'Mejora en eficiencia' },
    { icon: Award, label: 'Empleos Verdes', value: '120', color: 'bg-success text-success-foreground', description: 'Puestos de trabajo creados' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Registro Digital',
      description: 'Monitoreo en tiempo real de residuos generados por tipo y cantidad con tecnología de punta',
      color: 'from-primary to-accent',
    },
    {
      icon: BarChart3,
      title: 'Trazabilidad Total',
      description: 'Sistema completo de seguimiento desde la generación hasta el aprovechamiento final',
      color: 'from-secondary to-info',
    },
    {
      icon: Recycle,
      title: 'Economía Circular',
      description: 'Transformación de residuos en recursos productivos para granjas y compostaje',
      color: 'from-accent to-warning',
    },
    {
      icon: Award,
      title: 'Certificación ODS',
      description: 'Reconocimiento como "Establecimiento Sostenible" comprometido con los Objetivos de Desarrollo',
      color: 'from-success to-secondary',
    },
  ];

  const howItWorks = [
    { step: 1, title: 'Registro', description: 'Crea tu cuenta y registra tu establecimiento', icon: Building2, color: 'bg-primary' },
    { step: 2, title: 'Clasificación', description: 'Reporta tipo y cantidad de residuos', icon: Target, color: 'bg-secondary' },
    { step: 3, title: 'Recolección', description: 'Programamos la recogida optimizada', icon: Truck, color: 'bg-accent' },
    { step: 4, title: 'Transformación', description: 'Los residuos se convierten en recursos', icon: Factory, color: 'bg-success' },
    { step: 5, title: 'Distribución', description: 'Compost y alimento llegan a granjas', icon: TreePine, color: 'bg-info' },
    { step: 6, title: 'Certificación', description: 'Obtén tu certificado de sostenibilidad', icon: Award, color: 'bg-coral' },
  ];

  const benefits = [
    { icon: Leaf, title: 'Impacto Ambiental', description: 'Reduce tu huella de carbono y contribuye a un planeta más limpio', metric: '-40% CO₂' },
    { icon: TrendingUp, title: 'Ahorro Económico', description: 'Reduce costos de gestión de residuos y genera ingresos adicionales', metric: '+25% Ahorro' },
    { icon: Award, title: 'Reconocimiento', description: 'Diferénciate como establecimiento comprometido con el medio ambiente', metric: 'ODS 12' },
    { icon: Users, title: 'Comunidad', description: 'Únete a una red de empresas sostenibles en Nariño', metric: '+300 Aliados' },
    { icon: Shield, title: 'Cumplimiento', description: 'Cumple con las normativas ambientales de manera sencilla', metric: '100% Legal' },
    { icon: Zap, title: 'Eficiencia', description: 'Optimiza tus procesos de gestión de residuos con tecnología', metric: '+60% Eficiente' },
  ];

  const municipalities = [
    { name: 'Pasto', restaurants: 85, kg: 1200 },
    { name: 'Tumaco', restaurants: 45, kg: 680 },
    { name: 'Ipiales', restaurants: 38, kg: 520 },
    { name: 'Túquerres', restaurants: 28, kg: 380 },
    { name: 'La Unión', restaurants: 22, kg: 290 },
    { name: 'Otros', restaurants: 82, kg: 1930 },
  ];

  const testimonials = [
    { name: 'Restaurante El Sabor Nariñense', type: 'Restaurante', quote: 'EcoNariño nos ayudó a reducir nuestros residuos en un 45% y ahora somos reconocidos como establecimiento sostenible.', rating: 5 },
    { name: 'Plaza de Mercado Central', type: 'Mercado', quote: 'La plataforma es muy fácil de usar y la recolección siempre es puntual. Excelente servicio.', rating: 5 },
    { name: 'Granja Los Andes', type: 'Granja', quote: 'Ahora recibimos alimento de calidad para nuestros animales a un costo mucho menor.', rating: 5 },
  ];

  const odsGoals = [
    { number: 12, title: 'Producción y Consumo Responsables', description: 'Garantizar modalidades de consumo y producción sostenibles', progress: 75 },
    { number: 13, title: 'Acción por el Clima', description: 'Adoptar medidas urgentes para combatir el cambio climático', progress: 60 },
    { number: 11, title: 'Ciudades Sostenibles', description: 'Lograr que ciudades sean inclusivas, seguras y sostenibles', progress: 55 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Plataforma líder en gestión de residuos en Nariño</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transformando <span className="text-gradient">Residuos</span> en{' '}
                <span className="text-gradient-warm">Oportunidades</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                La plataforma <strong className="text-foreground">EcoNariño</strong> conecta restaurantes, plazas de mercado y centros de aprovechamiento para reducir el desperdicio de alimentos y promover la economía circular en el departamento de Nariño.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-8 animate-pulse-glow">
                      Ir al Panel de Control
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/registro">
                      <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-8">
                        Crear Cuenta Gratis
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="hover-lift text-lg px-8 border-2">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>100% Gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Fácil de usar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Soporte incluido</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="absolute -inset-4 gradient-hero opacity-25 blur-3xl rounded-3xl animate-float"></div>
              <img
                src={heroImage}
                alt="Gestión sostenible de residuos"
                className="relative rounded-2xl shadow-strong w-full h-auto hover-scale border-4 border-primary/20"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-medium border-2 border-primary/20 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">5,000 kg</div>
                    <div className="text-xs text-muted-foreground">Residuos aprovechados</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-medium border-2 border-secondary/20 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">-40% CO₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16">
            <div className="animate-bounce">
              <ArrowDown className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 gradient-cool opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center hover-lift shadow-medium border-2 border-transparent hover:border-primary/30 transition-smooth overflow-hidden relative group"
              >
                <div className={`absolute inset-0 ${stat.color} opacity-0 group-hover:opacity-5 transition-smooth`}></div>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${stat.color} flex items-center justify-center shadow-medium`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2 text-gradient">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is EcoNariño */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full gradient-primary opacity-5 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Nuestra Misión</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Qué es <span className="text-gradient">EcoNariño</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Una plataforma digital inteligente que gestiona y valoriza residuos orgánicos, conectando a generadores (restaurantes y plazas de mercado) con transformadores (centros de compostaje y granjas), creando un <strong className="text-foreground">ecosistema de economía circular</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -inset-4 gradient-secondary opacity-20 blur-3xl rounded-3xl"></div>
              <img
                src={circularEconomy}
                alt="Economía circular"
                className="relative rounded-2xl shadow-strong hover-scale border-4 border-secondary/20"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl font-bold mb-6">Economía Circular en Acción</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Nuestro sistema convierte un problema ambiental en una oportunidad económica. Los residuos orgánicos se transforman en:
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border-2 border-primary/10 hover-lift">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Compost de Calidad</h4>
                    <p className="text-sm text-muted-foreground">Para agricultura sostenible y huertos urbanos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border-2 border-secondary/10 hover-lift">
                  <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center flex-shrink-0">
                    <TreePine className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Alimento Animal</h4>
                    <p className="text-sm text-muted-foreground">Reduciendo costos de producción pecuaria</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border-2 border-accent/10 hover-lift">
                  <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Empleos Verdes</h4>
                    <p className="text-sm text-muted-foreground">En la cadena de aprovechamiento y transformación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Proceso Simple</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Cómo <span className="text-gradient-warm">Funciona</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Un proceso sencillo de 6 pasos para transformar tus residuos en recursos valiosos
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                <Card className="p-6 text-center hover-lift shadow-medium border-2 border-transparent hover:border-primary/30 transition-smooth h-full">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${item.color} flex items-center justify-center shadow-medium group-hover:scale-110 transition-smooth`}>
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-medium">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/2 h-full gradient-sunset opacity-5 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Tecnología Avanzada</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
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
                className="p-6 hover-lift shadow-medium border-2 border-transparent hover:border-primary/30 transition-smooth group overflow-hidden relative"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-smooth`}>
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 gradient-ocean opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Beneficios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Por qué unirte a <span className="text-gradient-cool">EcoNariño</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Múltiples beneficios para tu establecimiento y el medio ambiente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover-lift shadow-medium border-2 border-transparent hover:border-success/30 transition-smooth group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-smooth">
                    <benefit.icon className="w-7 h-7 text-success" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {benefit.metric}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ODS Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-5 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">Objetivos de Desarrollo Sostenible</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Alineados con los <span className="text-gradient">ODS</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Nuestro compromiso con la Agenda 2030 de las Naciones Unidas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {odsGoals.map((ods, index) => (
              <Card key={index} className="p-8 hover-lift shadow-medium border-2 border-secondary/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center shadow-medium">
                    <span className="text-2xl font-bold text-secondary-foreground">{ods.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ods.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6">{ods.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span className="font-bold text-secondary">{ods.progress}%</span>
                  </div>
                  <Progress value={ods.progress} className="h-3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Municipalities Map */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Cobertura Regional</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Presencia en todo <span className="text-gradient-warm">Nariño</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Nuestra red de establecimientos participantes se extiende por los principales municipios del departamento, creando un impacto ambiental significativo en toda la región.
              </p>

              <div className="space-y-4">
                {municipalities.map((mun, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="font-medium">{mun.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{mun.restaurants} establecimientos</span>
                      <span className="px-2 py-1 rounded-full bg-success/10 text-success font-medium">{mun.kg} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 gradient-warm opacity-20 blur-3xl rounded-3xl"></div>
              <Card className="p-8 shadow-strong relative">
                <h3 className="text-2xl font-bold mb-6 text-center">Estadísticas Regionales</h3>
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <PieChart className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <div className="text-4xl font-bold text-primary mb-1">300+</div>
                    <div className="text-sm text-muted-foreground">Establecimientos totales</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                      <div className="text-2xl font-bold text-secondary mb-1">5,000 kg</div>
                      <div className="text-xs text-muted-foreground">Aprovechados/mes</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-success/5 border border-success/20">
                      <div className="text-2xl font-bold text-success mb-1">12</div>
                      <div className="text-xs text-muted-foreground">Municipios activos</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-sunset opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Testimonios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lo que dicen nuestros <span className="text-gradient">Aliados</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover-lift shadow-medium border-2 border-accent/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.type}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-card relative overflow-hidden">
        <div className="absolute inset-0 gradient-cool opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 text-info mb-4">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Panel de Control</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-gradient-cool">Panel de Control</span> Inteligente
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Accede a métricas en tiempo real sobre tu impacto ambiental y gestiona todo desde un solo lugar:
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Residuos aprovechados por categoría</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span>Reducción de emisiones de CO₂</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span>Histórico y tendencias mensuales</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span>Certificados de sostenibilidad descargables</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-background border border-border">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  <span>Programación de recolecciones</span>
                </div>
              </div>
              <Link to="/registro">
                <Button size="lg" className="gradient-secondary hover-lift shadow-glow-secondary">
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 gradient-cool opacity-20 blur-3xl rounded-3xl"></div>
              <img
                src={dashboardPreview}
                alt="Dashboard de EcoNariño"
                className="relative rounded-2xl shadow-strong hover-scale border-4 border-info/20"
              />
              <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-xl shadow-medium border-2 border-info/20 animate-float">
                <div className="flex items-center gap-3">
                  <LineChart className="w-8 h-8 text-info" />
                  <div>
                    <div className="text-sm font-bold">Reportes detallados</div>
                    <div className="text-xs text-muted-foreground">Visualiza tu progreso</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-15"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Card className="p-12 md:p-16 text-center shadow-strong border-4 border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero opacity-5"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold">Comienza Hoy</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Únete a la <span className="text-gradient">Revolución Verde</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Forma parte de la red de establecimientos comprometidos con el medio ambiente. Comienza hoy a transformar tus residuos en recursos valiosos y obtén tu certificación de sostenibilidad.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-10 py-6">
                      Ir al Panel de Control
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/registro">
                      <Button size="lg" className="gradient-primary hover-lift shadow-glow text-lg px-10 py-6">
                        Registrar Establecimiento
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="hover-lift text-lg px-10 py-6 border-2">
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Sin costo de registro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Soporte técnico 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Certificación incluida</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">"</div>
            <p className="text-2xl md:text-3xl font-bold text-muted-foreground mb-6 leading-relaxed">
              Cuidar el planeta comienza con <span className="text-gradient">pequeñas acciones</span> que generan <span className="text-gradient-warm">grandes cambios</span>.
            </p>
            <p className="text-muted-foreground">— EcoNariño, Transformando residuos en oportunidades</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
