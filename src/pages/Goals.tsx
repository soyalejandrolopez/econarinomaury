import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Target, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Goals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [goals, setGoals] = useState([
    { id: 1, title: 'Reducir residuos 15%', target: 100, current: 78, unit: '%' },
    { id: 2, title: 'Alcanzar 1000 kg', target: 1000, current: 847, unit: 'kg' }
  ]);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', unit: 'kg' });

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.target) {
      toast({ title: 'Error', description: 'Completa todos los campos', variant: 'destructive' });
      return;
    }

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      current: 0,
      unit: newGoal.unit
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: '', unit: 'kg' });
    toast({ title: '¡Meta creada!', description: 'Tu nueva meta ha sido agregada' });
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    toast({ title: 'Meta eliminada', description: 'La meta ha sido removida' });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Establecer Metas</h1>
            <p className="text-muted-foreground">{user?.establishment}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {goals.map((goal) => (
              <Card key={goal.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-primary" />
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span className="font-semibold">{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground text-right">
                    {Math.round((goal.current / goal.target) * 100)}% completado
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Crear Nueva Meta
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Título de la Meta *</Label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Ej: Reducir residuos en 20%"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Objetivo *</Label>
                  <Input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    placeholder="Ej: 1000"
                  />
                </div>
                <div>
                  <Label>Unidad *</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="%">Porcentaje (%)</option>
                    <option value="pts">Puntos (pts)</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleAddGoal} className="w-full gradient-primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Crear Meta
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Goals;
