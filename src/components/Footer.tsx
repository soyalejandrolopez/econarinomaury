import { Link } from 'react-router-dom';
import {
  Leaf,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Globe,
  Heart,
  ArrowUpRight,
  Award,
  Building2,
  Users,
  Target,
  Recycle,
  TreePine,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const quickLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cómo Funciona', path: '/como-funciona' },
    { name: 'Beneficios', path: '/beneficios' },
    { name: 'Impacto Regional', path: '/impacto' },
    { name: 'Mapa de Recolección', path: '/mapa-recoleccion' },
  ];

  const servicesLinks = [
    { name: 'Registro de Generadores', path: '/registro' },
    { name: 'Trazabilidad', path: '/trazabilidad' },
    { name: 'Certificación ODS', path: '/certificado' },
    { name: 'Reportes', path: '/reportes' },
    { name: 'Metas de Sostenibilidad', path: '/metas' },
  ];

  const resourceLinks = [
    { name: 'Guía de Separación', path: '#' },
    { name: 'Preguntas Frecuentes', path: '#' },
    { name: 'Centro de Ayuda', path: '#' },
    { name: 'Blog', path: '#' },
    { name: 'Términos de Servicio', path: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
  ];

  const stats = [
    { icon: Building2, value: '300+', label: 'Establecimientos' },
    { icon: Recycle, value: '5,000', label: 'Kg Aprovechados' },
    { icon: Users, value: '120', label: 'Empleos Verdes' },
    { icon: TreePine, value: '12', label: 'Municipios' },
  ];

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Mantente Informado</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Únete a nuestra comunidad sostenible
            </h3>
            <p className="text-background/80 mb-6 max-w-xl mx-auto">
              Recibe noticias, consejos de sostenibilidad y actualizaciones sobre el impacto de EcoNariño en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:border-primary"
              />
              <Button className="gradient-primary hover-lift whitespace-nowrap">
                Suscribirse
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-background/10 bg-background/5">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-background/70">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center shadow-glow transition-smooth group-hover:scale-110">
                <Leaf className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">EcoNariño</span>
            </Link>
            <p className="text-sm text-background/80 mb-6 leading-relaxed">
              Plataforma inteligente de gestión de residuos orgánicos que transforma el desperdicio en oportunidades.
              Conectamos restaurantes, plazas de mercado y centros de aprovechamiento para construir un Nariño más sostenible.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-background/10 flex items-center justify-center transition-all duration-300 hover:text-background ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-background/70">
              <Award className="w-4 h-4 text-accent" />
              <span>Alineados con los ODS 11, 12 y 13</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Explorar
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/80 hover:text-primary transition-smooth flex items-center gap-2 group"
                  >
                    <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-smooth" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-secondary" />
              Servicios
            </h4>
            <ul className="space-y-3">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-background/80 hover:text-secondary transition-smooth flex items-center gap-2 group"
                  >
                    <CheckCircle2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-smooth" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Ubicación</div>
                  <div className="text-background/70">Pasto, Nariño, Colombia</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="font-medium">Teléfono</div>
                  <div className="text-background/70">+57 (2) 731-0555</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-background/70">contacto@econarino.com</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-background/70 text-center md:text-left">
              <p>© 2025 EcoNariño - Proyecto de Ingeniería I</p>
              <p>Universidad Nacional Abierta y a Distancia (UNAD)</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-background/70">
              <Link to="#" className="hover:text-primary transition-smooth">Privacidad</Link>
              <Link to="#" className="hover:text-primary transition-smooth">Términos</Link>
              <Link to="#" className="hover:text-primary transition-smooth">Cookies</Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-background/70">Hecho con</span>
              <Heart className="w-4 h-4 text-destructive fill-destructive" />
              <span className="text-background/70">en Nariño</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Commitment Banner */}
      <div className="gradient-hero">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-primary-foreground text-sm font-medium">
            <Leaf className="w-5 h-5" />
            <span>Juntos construimos un Nariño sostenible</span>
            <Recycle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
