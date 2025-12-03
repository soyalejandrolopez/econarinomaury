import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { UserPlus, Building2, MapPin, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    establishment: '',
    type: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
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
        
        // Esperar un momento para que la sesión se establezca
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                <UserPlus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gradient">Registro de Generadores</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Únete a la red de establecimientos sostenibles de Nariño
              </p>
            </div>

            <Card className="p-8 shadow-strong border-2 hover:border-primary/20 transition-smooth">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
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
                  <Label htmlFor="email">Correo Electrónico *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishment">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Nombre del Establecimiento *
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
                  <Label htmlFor="type">Tipo de Establecimiento *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurante</SelectItem>
                      <SelectItem value="market">Plaza de Mercado</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="catering">Catering/Eventos</SelectItem>
                      <SelectItem value="farm">Granja/Finca</SelectItem>
                      <SelectItem value="collection">Centro de Acopio</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Ciudad o Municipio *
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
                      <SelectItem value="pasto">Pasto</SelectItem>
                      <SelectItem value="ipiales">Ipiales</SelectItem>
                      <SelectItem value="tumaco">Tumaco</SelectItem>
                      <SelectItem value="tuquerres">Túquerres</SelectItem>
                      <SelectItem value="sandona">Sandoná</SelectItem>
                      <SelectItem value="la_union">La Unión</SelectItem>
                      <SelectItem value="other">Otro municipio</SelectItem>
                    </SelectContent>
                  </Select>
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
                      Registrando...
                    </>
                  ) : (
                    'Registrar Establecimiento'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Iniciar sesión aquí
                  </Link>
                </p>
              </form>
            </Card>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-success/10 text-success">
                <span className="text-2xl">🌱</span>
                <p className="text-sm font-medium">
                  Al registrarte, contribuyes directamente al ODS 12: Producción y Consumo Responsables
                </p>
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
