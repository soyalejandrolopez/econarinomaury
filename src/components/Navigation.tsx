import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Leaf,
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  Calendar,
  Award,
  BarChart3,
  Target,
  MapPin,
  Eye,
  LogOut,
  Settings,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const publicNavLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Cómo Funciona', path: '/como-funciona' },
    { name: 'Beneficios', path: '/beneficios' },
    { name: 'Impacto', path: '/impacto' },
    { name: 'Mapa', path: '/mapa-recoleccion' },
  ];

  const dashboardLinks = [
    { name: 'Panel Principal', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Programar Recolección', path: '/programar-recoleccion', icon: Calendar },
    { name: 'Trazabilidad', path: '/trazabilidad', icon: Eye },
    { name: 'Reportes', path: '/reportes', icon: BarChart3 },
    { name: 'Metas', path: '/metas', icon: Target },
    { name: 'Certificado', path: '/certificado', icon: Award },
  ];

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'market': 'Plaza de Mercado',
      'hotel': 'Hotel',
      'farm': 'Granja',
      'collection': 'Centro de Acopio'
    };
    return types[type] || 'Establecimiento';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shadow-glow transition-smooth group-hover:scale-110">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">EcoNariño</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {publicNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-muted ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Dashboard Quick Access */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover-lift border-2 gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Mi Panel
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Acceso Rápido</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dashboardLinks.map((link) => (
                      <DropdownMenuItem
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="cursor-pointer"
                      >
                        <link.icon className="w-4 h-4 mr-2" />
                        {link.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gradient-primary hover-lift gap-2 pr-3">
                      <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-3">
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {getTypeLabel(user.type)}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Panel de Control
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/certificado')} className="cursor-pointer">
                      <Award className="w-4 h-4 mr-2" />
                      Mi Certificado
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Ayuda
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="hover-lift border-2">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/registro">
                  <Button className="gradient-primary hover-lift shadow-glow">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-1">
              {/* Public Links */}
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-smooth hover:bg-muted flex items-center gap-2 ${
                    location.pathname === link.path ? 'bg-muted text-primary' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Authenticated Links */}
              {isAuthenticated && user && (
                <>
                  <div className="border-t border-border my-2"></div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Mi Panel
                  </div>
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 rounded-lg transition-smooth hover:bg-muted flex items-center gap-3 ${
                        location.pathname === link.path ? 'bg-muted text-primary' : ''
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Auth Buttons */}
              <div className="border-t border-border mt-2 pt-4 px-4">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.establishment}</div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      variant="outline"
                      className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/registro" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gradient-primary">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
