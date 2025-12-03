-- Schema completo para EcoNariño Circular
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de estadísticas del usuario
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  waste_collected DECIMAL(10,2) DEFAULT 0,
  co2_reduced DECIMAL(10,2) DEFAULT 0,
  economic_savings DECIMAL(10,2) DEFAULT 0,
  sustainability_points INTEGER DEFAULT 0,
  month DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- 2. Tabla de actividad reciente
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  amount TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Actualizar tabla collections (ya existe)
ALTER TABLE collections ADD COLUMN IF NOT EXISTS actual_weight DECIMAL(10,2);
ALTER TABLE collections ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- 4. Tabla de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  total_waste DECIMAL(10,2) NOT NULL,
  co2_reduced DECIMAL(10,2) NOT NULL,
  points INTEGER NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para activities
CREATE POLICY "Users can view own activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para certificates
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certificates" ON certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS user_stats_user_id_idx ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS user_stats_month_idx ON user_stats(month);
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON certificates(user_id);

-- Función para actualizar estadísticas cuando se completa una recolección
CREATE OR REPLACE FUNCTION update_user_stats_on_collection()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO user_stats (user_id, waste_collected, co2_reduced, economic_savings, sustainability_points, month)
    VALUES (
      (SELECT id FROM auth.users WHERE email = NEW.user_id),
      NEW.actual_weight,
      NEW.actual_weight * 0.5,
      NEW.actual_weight * 380,
      FLOOR(NEW.actual_weight * 1.5),
      DATE_TRUNC('month', NEW.completed_at)
    )
    ON CONFLICT (user_id, month) 
    DO UPDATE SET
      waste_collected = user_stats.waste_collected + NEW.actual_weight,
      co2_reduced = user_stats.co2_reduced + (NEW.actual_weight * 0.5),
      economic_savings = user_stats.economic_savings + (NEW.actual_weight * 380),
      sustainability_points = user_stats.sustainability_points + FLOOR(NEW.actual_weight * 1.5);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_collection
  AFTER UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_collection();
