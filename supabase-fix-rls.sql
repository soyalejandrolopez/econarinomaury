-- =====================================================
-- FIX: Corregir políticas RLS y tipos de user_id
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABLA COLLECTIONS
-- =====================================================

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can view own collections" ON collections;
DROP POLICY IF EXISTS "Users can insert own collections" ON collections;
DROP POLICY IF EXISTS "Users can update own collections" ON collections;
DROP POLICY IF EXISTS "Users can delete own collections" ON collections;

-- Cambiar user_id de TEXT a UUID (si tiene datos, migrarlos primero)
-- Primero agregar columna temporal
ALTER TABLE collections ADD COLUMN IF NOT EXISTS user_id_new UUID;

-- Si hay datos existentes con email, intentar mapearlos (ignorar errores si no hay datos)
DO $$
BEGIN
  UPDATE collections c
  SET user_id_new = p.id
  FROM profiles p
  WHERE c.user_id = p.email AND c.user_id_new IS NULL;
EXCEPTION WHEN OTHERS THEN
  -- Ignorar errores
  NULL;
END $$;

-- Si user_id ya es un UUID válido, copiarlo directamente
DO $$
BEGIN
  UPDATE collections
  SET user_id_new = user_id::UUID
  WHERE user_id_new IS NULL AND user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
EXCEPTION WHEN OTHERS THEN
  -- Ignorar errores
  NULL;
END $$;

-- Eliminar columna vieja y renombrar nueva (solo si la nueva tiene datos o está vacía la tabla)
DO $$
BEGIN
  -- Solo hacer el cambio si no hay filas O todas las filas tienen user_id_new
  IF (SELECT COUNT(*) FROM collections WHERE user_id_new IS NULL) = 0 THEN
    ALTER TABLE collections DROP COLUMN user_id;
    ALTER TABLE collections RENAME COLUMN user_id_new TO user_id;
    ALTER TABLE collections ALTER COLUMN user_id SET NOT NULL;
  ELSE
    -- Si hay datos sin migrar, eliminar la columna temporal
    ALTER TABLE collections DROP COLUMN IF EXISTS user_id_new;
  END IF;
END $$;

-- Asegurar que RLS está habilitado
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Crear nuevas políticas correctas
CREATE POLICY "collections_select_policy" ON collections
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "collections_insert_policy" ON collections
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "collections_update_policy" ON collections
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "collections_delete_policy" ON collections
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- =====================================================
-- 2. TABLA GOALS
-- =====================================================

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

-- Migrar user_id de TEXT a UUID
ALTER TABLE goals ADD COLUMN IF NOT EXISTS user_id_new UUID;

DO $$
BEGIN
  UPDATE goals g
  SET user_id_new = p.id
  FROM profiles p
  WHERE g.user_id = p.email AND g.user_id_new IS NULL;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  UPDATE goals
  SET user_id_new = user_id::UUID
  WHERE user_id_new IS NULL AND user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM goals WHERE user_id_new IS NULL) = 0 THEN
    ALTER TABLE goals DROP COLUMN user_id;
    ALTER TABLE goals RENAME COLUMN user_id_new TO user_id;
    ALTER TABLE goals ALTER COLUMN user_id SET NOT NULL;
  ELSE
    ALTER TABLE goals DROP COLUMN IF EXISTS user_id_new;
  END IF;
END $$;

-- Asegurar que RLS está habilitado
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Crear nuevas políticas
CREATE POLICY "goals_select_policy" ON goals
  FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "goals_insert_policy" ON goals
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "goals_update_policy" ON goals
  FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "goals_delete_policy" ON goals
  FOR DELETE USING (user_id::text = auth.uid()::text);

-- =====================================================
-- 3. VERIFICAR POLÍTICAS DE OTRAS TABLAS
-- =====================================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- User Stats
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;

CREATE POLICY "user_stats_select_policy" ON user_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_stats_insert_policy" ON user_stats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_stats_update_policy" ON user_stats
  FOR UPDATE USING (user_id = auth.uid());

-- Activities
DROP POLICY IF EXISTS "Users can view own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;

CREATE POLICY "activities_select_policy" ON activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "activities_insert_policy" ON activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Certificates
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
DROP POLICY IF EXISTS "Users can insert own certificates" ON certificates;

CREATE POLICY "certificates_select_policy" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "certificates_insert_policy" ON certificates
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 4. CREAR ÍNDICES SI NO EXISTEN
-- =====================================================
CREATE INDEX IF NOT EXISTS collections_user_id_idx ON collections(user_id);
CREATE INDEX IF NOT EXISTS collections_status_idx ON collections(status);
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);

-- =====================================================
-- LISTO! Verifica que todo funcione correctamente
-- =====================================================
