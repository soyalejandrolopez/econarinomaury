import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LogIn, Leaf, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa tu correo y contraseña',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: '¡Bienvenido de nuevo!',
        description: 'Accediendo a tu panel de control...',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      toast({
        title: 'Error de autenticación',
        description: result.error || 'Correo o contraseña incorrectos',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 min-h-[calc(100vh-80px)] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                <LogIn className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gradient">Iniciar Sesión</span>
              </h1>
              <p className="text-muted-foreground">
                Accede a tu panel de gestión de residuos
              </p>
            </div>

            <Card className="p-8 shadow-strong border-2 hover:border-primary/20 transition-smooth">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-primary hover-lift shadow-glow h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/registro" className="text-primary hover:underline font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </form>
            </Card>

            <div className="mt-8 p-4 rounded-lg bg-card border shadow-soft">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Acceso Seguro</p>
                  <p>Tus datos están protegidos y tu privacidad es nuestra prioridad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
