import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  LogIn,
  Leaf,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

    try {
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: '¡Bienvenido de nuevo!',
          description: 'Accediendo a tu panel de control...',
        });

        // Verificar el rol del usuario para redirigir
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const isAdmin = profile?.role === 'admin';

          setTimeout(() => {
            navigate(isAdmin ? '/admin' : '/dashboard');
          }, 1000);
        } else {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      } else {
        setIsLoading(false);
        toast({
          title: 'Error de autenticación',
          description: result.error || 'Correo o contraseña incorrectos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  const benefits = [
    { icon: Building2, text: '300+ establecimientos conectados' },
    { icon: Users, text: 'Comunidad sostenible en crecimiento' },
    { icon: Award, text: 'Certificación ODS incluida' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Info */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-3xl"></div>
                <div className="relative space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Plataforma de Gestión Sostenible</span>
                  </div>
                  <h2 className="text-4xl font-bold">
                    Bienvenido de nuevo a <span className="text-gradient">EcoNariño</span>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Accede a tu panel de control y continúa transformando residuos en oportunidades.
                    Tu impacto ambiental te espera.
                  </p>

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover-lift">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="font-medium">{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-xl gradient-cool text-primary-foreground relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold">Acceso Seguro</span>
                      </div>
                      <p className="text-sm opacity-90">
                        Tu información está protegida con encriptación de nivel bancario.
                        Tu privacidad es nuestra prioridad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="text-center mb-8 lg:text-left">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto lg:mx-0 mb-4 shadow-glow animate-pulse-glow">
                  <LogIn className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-gradient">Iniciar Sesión</span>
                </h1>
                <p className="text-muted-foreground">
                  Accede a tu panel de gestión de residuos
                </p>
              </div>

              <Card className="p-8 shadow-strong border-2 hover:border-primary/20 transition-smooth">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-4 pr-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-4 pr-12"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Recordar sesión
                      </label>
                    </div>
                    <Link to="#" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-primary hover-lift shadow-glow h-12 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        Iniciar Sesión
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/registro" className="text-primary hover:underline font-medium">
                      Regístrate gratis
                    </Link>
                  </p>
                </div>
              </Card>

              {/* Mobile Benefits */}
              <div className="lg:hidden mt-8 p-4 rounded-lg bg-card border shadow-soft">
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
      </div>

      <Footer />
    </div>
  );
};

export default Login;
