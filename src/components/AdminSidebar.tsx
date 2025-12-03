import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Activity,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Globe,
  MapPin
} from 'lucide-react';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard Admin', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
    { icon: Activity, label: 'Actividades', path: '/admin/actividades' },
    { icon: Truck, label: 'Recolecciones', path: '/admin/recolecciones' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reportes' },
    { icon: MapPin, label: 'Mapa Global', path: '/admin/mapa' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">EcoNariño</span>
                    <span className="text-xs text-purple-500 block -mt-1">Admin</span>
                  </div>
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
            <div className="p-4 border-b border-border bg-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-purple-500 font-medium">Administrador</p>
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
                          ? 'bg-purple-500 text-white'
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

            {/* Separator */}
            <div className="my-4 border-t border-border"></div>

            {/* Link to User Dashboard */}
            {!collapsed && (
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">Ver Dashboard Usuario</span>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => navigate('/admin')}
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

export default AdminSidebar;
