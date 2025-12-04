import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Target,
  Award,
  MapPin,
  Route,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Users,
  Shield
} from 'lucide-react';

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Programar Recolección', path: '/programar-recoleccion' },
    { icon: Award, label: 'Certificado', path: '/certificado' },
    { icon: FileText, label: 'Reportes', path: '/reportes' },
    { icon: Target, label: 'Metas', path: '/metas' },
    { icon: MapPin, label: 'Mapa', path: '/mapa-recoleccion' },
    { icon: Route, label: 'Trazabilidad', path: '/trazabilidad' },
  ];

  // Agregar opción de admin si el usuario es administrador
  const adminMenuItems = isAdmin ? [
    { icon: Users, label: 'Administrar Usuarios', path: '/admin/usuarios' },
  ] : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">E</span>
                  </div>
                  <span className="font-bold text-lg">EcoNariño</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={collapsed ? 'mx-auto' : ''}
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* User Info */}
          {!collapsed && user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.establishment}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Admin Menu */}
            {isAdmin && adminMenuItems.length > 0 && (
              <>
                <div className={`my-4 border-t border-border ${collapsed ? '' : 'mx-2'}`} />
                {!collapsed && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    Administración
                  </div>
                )}
                <ul className="space-y-2">
                  {adminMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          } ${collapsed ? 'justify-center' : ''}`}
                          title={collapsed ? item.label : ''}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Configuración</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${
                collapsed ? 'px-0 justify-center' : ''
              }`}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="ml-3">Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30" />
    </>
  );
};

export default DashboardSidebar;
