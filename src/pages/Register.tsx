import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  UserPlus,
  Building2,
  MapPin,
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Leaf,
  Award,
  Recycle,
  TrendingUp,
  Globe
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    establishment: '',
    type: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.establishment || !formData.type || !formData.city) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Error',
        description: 'Debes aceptar los términos y condiciones',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        toast({
          title: '¡Registro Exitoso!',
          description: 'Redirigiendo a tu panel...',
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast({
          title: 'Error en el registro',
          description: result.error || 'No se pudo completar el registro',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Award, title: 'Certificación ODS', description: 'Obtén tu certificado de sostenibilidad' },
    { icon: Recycle, title: 'Trazabilidad', description: 'Sigue el destino de tus residuos' },
    { icon: TrendingUp, title: 'Ahorro', description: 'Reduce costos de gestión' },
    { icon: Globe, title: 'Impacto', description: 'Contribuye al medio ambiente' },
  ];

  const establishmentTypes = [
    { value: 'restaurant', label: 'Restaurante', icon: '🍽️' },
    { value: 'market', label: 'Plaza de Mercado', icon: '🏪' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'catering', label: 'Catering/Eventos', icon: '🎉' },
    { value: 'farm', label: 'Granja/Finca', icon: '🌾' },
    { value: 'collection', label: 'Centro de Acopio', icon: '♻️' },
    { value: 'other', label: 'Otro', icon: '🏢' },
  ];

  const cities = [
    { value: 'pasto', label: 'Pasto' },
    { value: 'ipiales', label: 'Ipiales' },
    { value: 'tumaco', label: 'Tumaco' },
    { value: 'tuquerres', label: 'Túquerres' },
    { value: 'sandona', label: 'Sandoná' },
    { value: 'la_union', label: 'La Unión' },
    { value: 'samaniego', label: 'Samaniego' },
    { value: 'other', label: 'Otro municipio' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
            {/* Left Side - Info */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="sticky top-24">
                <div className="relative">
                  <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-3xl"></div>
                  <div className="relative space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Únete a la revolución verde</span>
                    </div>
                    <h2 className="text-4xl font-bold">
                      Comienza tu viaje hacia la <span className="text-gradient">sostenibilidad</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Registra tu establecimiento y forma parte de la red de empresas comprometidas
                      con el medio ambiente en Nariño.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {benefits.map((benefit, index) => (
                        <Card key={index} className="p-4 hover-lift border-2 border-transparent hover:border-primary/20">
                          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-3">
                            <benefit.icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <h3 className="font-bold mb-1">{benefit.title}</h3>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </Card>
                      ))}
                    </div>

                    <div className="p-6 rounded-xl gradient-warm text-primary-foreground relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="w-5 h-5" />
                          <span className="font-bold">100% Gratuito</span>
                        </div>
                        <p className="text-sm opacity-90">
                          El registro es completamente gratis. Solo necesitas unos minutos
                          para comenzar a generar impacto positivo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <div className="text-center mb-8 lg:text-left">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto lg:mx-0 mb-4 shadow-glow">
                  <UserPlus className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="text-gradient">Registro de Generadores</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Únete a la red de establecimientos sostenibles de Nariño
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-sm font-medium hidden sm:inline">Datos Personales</span>
                </div>
                <div className="w-8 h-0.5 bg-border"></div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <span className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-sm font-medium hidden sm:inline">Establecimiento</span>
                </div>
              </div>

              <Card className="p-8 shadow-strong border-2 hover:border-primary/20 transition-smooth">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Nombre Completo
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Tu nombre completo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12"
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Correo Electrónico
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@correo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Contraseña
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Mínimo 6 caracteres"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="h-12 pr-12"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-primary" />
                            Confirmar Contraseña
                          </Label>
                          <Input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Repite tu contraseña"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="h-12"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => {
                          if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                            toast({
                              title: 'Error',
                              description: 'Por favor completa todos los campos',
                              variant: 'destructive',
                            });
                            return;
                          }
                          if (formData.password !== formData.confirmPassword) {
                            toast({
                              title: 'Error',
                              description: 'Las contraseñas no coinciden',
                              variant: 'destructive',
                            });
                            return;
                          }
                          setStep(2);
                        }}
                        size="lg"
                        className="w-full gradient-primary hover-lift shadow-glow h-12 text-lg"
                      >
                        Continuar
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="establishment" className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Nombre del Establecimiento
                        </Label>
                        <Input
                          id="establishment"
                          type="text"
                          placeholder="Ej: Restaurante El Buen Sabor"
                          value={formData.establishment}
                          onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                          className="h-12"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 mb-3">
                          Tipo de Establecimiento
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {establishmentTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, type: type.value })}
                              className={`p-4 rounded-xl border-2 text-center transition-smooth hover-lift ${
                                formData.type === type.value
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              disabled={isLoading}
                            >
                              <div className="text-2xl mb-1">{type.icon}</div>
                              <div className="text-xs font-medium">{type.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Ciudad o Municipio
                        </Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) => setFormData({ ...formData, city: value })}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecciona tu ubicación" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.value} value={city.value}>
                                {city.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                        <Checkbox
                          id="terms"
                          checked={acceptTerms}
                          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        />
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          Acepto los <Link to="#" className="text-primary hover:underline">términos y condiciones</Link> y
                          la <Link to="#" className="text-primary hover:underline">política de privacidad</Link> de EcoNariño
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          size="lg"
                          className="h-12 border-2"
                          disabled={isLoading}
                        >
                          Atrás
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-1 gradient-primary hover-lift shadow-glow h-12 text-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Registrando...
                            </>
                          ) : (
                            <>
                              Crear Cuenta
                              <CheckCircle2 className="ml-2 w-5 h-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </Card>

              {/* ODS Badge */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-success/10 to-secondary/10 border border-success/20">
                  <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary-foreground">12</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">ODS 12: Producción y Consumo Responsables</div>
                    <div className="text-xs text-muted-foreground">
                      Al registrarte, contribuyes directamente a este objetivo global
                    </div>
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

export default Register;
