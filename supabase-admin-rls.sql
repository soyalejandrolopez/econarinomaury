-- =====================================================
-- Políticas RLS para Administradores
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Función helper para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PROFILES: Admins pueden ver todos los perfiles
-- =====================================================

-- Eliminar política de lectura existente si existe
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins pueden leer todos los perfiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- =====================================================
-- COLLECTIONS: Admins pueden ver todas las colecciones
-- =====================================================

-- Eliminar política de lectura existente si existe
DROP POLICY IF EXISTS "Users can read own collections" ON collections;
DROP POLICY IF EXISTS "Admins can read all collections" ON collections;

-- Usuarios pueden leer sus propias colecciones
CREATE POLICY "Users can read own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

-- Admins pueden leer todas las colecciones
CREATE POLICY "Admins can read all collections"
  ON collections FOR SELECT
  USING (is_admin());

-- =====================================================
-- Cómo hacer a un usuario administrador
-- =====================================================
-- Para convertir un usuario en admin, ejecuta:
-- UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- Para ver los admins actuales:
-- SELECT name, email, role FROM profiles WHERE role = 'admin';

-- =====================================================
-- Agregar columna role si no existe
-- =====================================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Asegurar que la columna role tenga un valor por defecto
ALTER TABLE profiles
ALTER COLUMN role SET DEFAULT 'user';

-- Actualizar perfiles existentes sin role
UPDATE profiles SET role = 'user' WHERE role IS NULL;
