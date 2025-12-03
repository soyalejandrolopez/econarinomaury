import { Leaf, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EcoNariño</span>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Transformando residuos en oportunidades. Plataforma inteligente de gestión de residuos orgánicos que conecta restaurantes, plazas de mercado y centros de aprovechamiento en Nariño.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-smooth hover-scale">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-smooth hover-scale">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-smooth hover-scale">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/" className="hover:text-primary transition-smooth">Inicio</Link></li>
              <li><Link to="/como-funciona" className="hover:text-primary transition-smooth">Cómo Funciona</Link></li>
              <li><Link to="/beneficios" className="hover:text-primary transition-smooth">Beneficios</Link></li>
              <li><Link to="/impacto" className="hover:text-primary transition-smooth">Impacto</Link></li>
              <li><Link to="/registro" className="hover:text-primary transition-smooth">Registrarse</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Nariño, Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+57 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@econarino.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm opacity-80">
          <p>© 2025 EcoNariño - Proyecto de Ingeniería I - Universidad Nacional Abierta y a Distancia (UNAD)</p>
          <p className="mt-2 text-gradient font-semibold">Juntos construimos un Nariño sostenible 🌱</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
