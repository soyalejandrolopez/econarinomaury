import { useState, useEffect } from 'react';
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
import {
  Calendar,
  ArrowLeft,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Collection {
  id: string;
  user_id: string;
  date: string;
  time: string;
  waste_type: string;
  estimated_weight: number;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

const ScheduleCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    wasteType: '',
    estimatedWeight: '',
    notes: ''
  });

  // Cargar colecciones
  const loadCollections = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar las recolecciones', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, [user?.id]);

  // Reset form
  const resetForm = () => {
    setFormData({ date: '', time: '', wasteType: '', estimatedWeight: '', notes: '' });
    setEditingCollection(null);
    setShowForm(false);
  };

  // Abrir formulario para editar
  const openEditForm = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      date: collection.date,
      time: collection.time,
      wasteType: collection.waste_type,
      estimatedWeight: collection.estimated_weight.toString(),
      notes: collection.notes || ''
    });
    setShowForm(true);
  };

  // Abrir formulario para crear
  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Guardar (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      if (editingCollection) {
        // Actualizar
        const { error } = await supabase
          .from('collections')
          .update({
            date: formData.date,
            time: formData.time,
            waste_type: formData.wasteType,
            estimated_weight: parseFloat(formData.estimatedWeight),
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCollection.id);

        if (error) throw error;
        toast({ title: 'Actualizado', description: 'Recolección actualizada correctamente' });
      } else {
        // Crear
        const { error } = await supabase
          .from('collections')
          .insert({
            user_id: user.id,
            date: formData.date,
            time: formData.time,
            waste_type: formData.wasteType,
            estimated_weight: parseFloat(formData.estimatedWeight),
            notes: formData.notes,
            status: 'pending'
          });

        if (error) throw error;
        toast({ title: 'Creado', description: 'Recolección programada correctamente' });
      }

      dataCache.clear(`collections_${user.id}`);
      resetForm();
      loadCollections();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast({ title: 'Error', description: 'No se pudo guardar la recolección', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Eliminar
  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    if (!confirm('¿Estás seguro de eliminar esta recolección?')) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dataCache.clear(`collections_${user.id}`);
      toast({ title: 'Eliminado', description: 'Recolección eliminada correctamente' });
      loadCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({ title: 'Error', description: 'No se pudo eliminar la recolección', variant: 'destructive' });
    }
  };

  // Ver trazabilidad
  const viewTraceability = (collection: Collection) => {
    navigate(`/trazabilidad?collection_id=${collection.id}`);
  };

  // Helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-amber-500/10 text-amber-500';
    }
  };

  const getWasteTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'organicos': 'Orgánicos',
      'compostables': 'Compostables',
      'reciclables': 'Reciclables',
      'mixtos': 'Mixtos'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Mis Recolecciones</h1>
                  <p className="text-muted-foreground">Gestiona tus recolecciones programadas</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadCollections} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button onClick={openCreateForm} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Recolección
              </Button>
            </div>
          </div>

          {/* Modal de Formulario */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">
                      {editingCollection ? 'Editar Recolección' : 'Nueva Recolección'}
                    </h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha *</Label>
                      <Input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Hora *</Label>
                      <Input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Tipo de Residuo *</Label>
                    <Select
                      value={formData.wasteType}
                      onValueChange={(value) => setFormData({ ...formData, wasteType: value })}
                    >
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
                    <Input
                      type="number"
                      required
                      step="0.1"
                      min="0.1"
                      value={formData.estimatedWeight}
                      onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                      placeholder="Ej: 25.5"
                    />
                  </div>

                  <div>
                    <Label>Notas adicionales</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Información adicional..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 gradient-primary" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : editingCollection ? (
                        'Actualizar'
                      ) : (
                        'Programar'
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Tabla de Recolecciones */}
          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-bold mb-2">No hay recolecciones</h3>
                <p className="text-muted-foreground mb-4">
                  Programa tu primera recolección para comenzar
                </p>
                <Button onClick={openCreateForm} className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Recolección
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hora</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Peso Est.</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection) => (
                      <tr
                        key={collection.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium">
                            {new Date(collection.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{collection.time}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {getWasteTypeLabel(collection.waste_type)}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium">{collection.estimated_weight} kg</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(collection.status)}`}>
                            {getStatusIcon(collection.status)}
                            {getStatusLabel(collection.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => viewTraceability(collection)}
                              title="Ver trazabilidad"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {collection.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditForm(collection)}
                                  title="Editar"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(collection.id)}
                                  className="text-destructive hover:text-destructive"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCollection;
