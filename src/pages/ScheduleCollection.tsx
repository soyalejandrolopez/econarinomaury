import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { dataCache } from '@/lib/cache';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ScheduleCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    wasteType: '',
    estimatedWeight: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('collections').insert({
        user_id: user.email,
        date: formData.date,
        time: formData.time,
        waste_type: formData.wasteType,
        estimated_weight: parseFloat(formData.estimatedWeight),
        notes: formData.notes,
        status: 'pending'
      });

      if (error) throw error;

      dataCache.clear(`collections_${user.email}`);
      dataCache.clear(`activities_${user.email}_6`);
      toast({ title: '¡Recolección programada!', description: 'Te notificaremos cuando esté confirmada.' });
      navigate('/dashboard');
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo programar la recolección', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Programar Recolección</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Fecha *</Label>
                  <Input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label>Hora *</Label>
                  <Input type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              <div>
                <Label>Tipo de Residuo *</Label>
                <Select value={formData.wasteType} onValueChange={(value) => setFormData({...formData, wasteType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organicos">Orgánicos</SelectItem>
                    <SelectItem value="compostables">Compostables</SelectItem>
                    <SelectItem value="reciclables">Reciclables</SelectItem>
                    <SelectItem value="mixtos">Mixtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Peso Estimado (kg) *</Label>
                <Input type="number" required step="0.1" value={formData.estimatedWeight} onChange={(e) => setFormData({...formData, estimatedWeight: e.target.value})} placeholder="Ej: 25.5" />
              </div>

              <div>
                <Label>Notas adicionales</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Información adicional sobre la recolección..." rows={4} />
              </div>

              <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Programando...</> : 'Programar Recolección'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCollection;
