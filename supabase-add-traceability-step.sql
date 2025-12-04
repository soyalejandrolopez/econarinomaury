-- =====================================================
-- Agregar columna traceability_step a collections
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Agregar columna de etapa de trazabilidad
ALTER TABLE collections
ADD COLUMN IF NOT EXISTS traceability_step TEXT DEFAULT 'generacion';

-- Actualizar registros existentes basados en el status
UPDATE collections
SET traceability_step = CASE
  WHEN status = 'completed' THEN 'distribucion'
  WHEN status = 'cancelled' THEN 'generacion'
  ELSE 'generacion'
END
WHERE traceability_step IS NULL OR traceability_step = '';

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS collections_traceability_step_idx ON collections(traceability_step);

-- Comentario para documentación
COMMENT ON COLUMN collections.traceability_step IS 'Etapa actual de trazabilidad: generacion, recoleccion, procesamiento, transformacion, distribucion';
