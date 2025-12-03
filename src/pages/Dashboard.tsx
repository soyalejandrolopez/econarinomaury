import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardView from '@/views/DashboardView';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, session, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando tu panel de control...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardView user={user} session={session} />
      </div>
    </div>
  );
};

export default Dashboard;
