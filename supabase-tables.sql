-- Tabla para recolecciones programadas
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  waste_type TEXT NOT NULL,
  estimated_weight DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para metas de usuarios
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  target DECIMAL(10,2) NOT NULL,
  current DECIMAL(10,2) DEFAULT 0,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Políticas para collections
CREATE POLICY "Users can view own collections" 
  ON collections FOR SELECT 
  USING (user_id = current_user);

CREATE POLICY "Users can insert own collections" 
  ON collections FOR INSERT 
  WITH CHECK (user_id = current_user);

CREATE POLICY "Users can update own collections" 
  ON collections FOR UPDATE 
  USING (user_id = current_user);

-- Políticas para goals
CREATE POLICY "Users can view own goals" 
  ON goals FOR SELECT 
  USING (user_id = current_user);

CREATE POLICY "Users can insert own goals" 
  ON goals FOR INSERT 
  WITH CHECK (user_id = current_user);

CREATE POLICY "Users can update own goals" 
  ON goals FOR UPDATE 
  USING (user_id = current_user);

CREATE POLICY "Users can delete own goals" 
  ON goals FOR DELETE 
  USING (user_id = current_user);

-- Índices
CREATE INDEX IF NOT EXISTS collections_user_id_idx ON collections(user_id);
CREATE INDEX IF NOT EXISTS collections_date_idx ON collections(date);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
