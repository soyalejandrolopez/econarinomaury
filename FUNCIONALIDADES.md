# Funcionalidades - Acciones Rápidas

## 📋 Modelo Vista Controlador Implementado

### 1. **Programar Recolección** 
**Ruta:** `/programar-recoleccion`

**Modelo:**
- Tabla: `collections`
- Campos: user_id, date, time, waste_type, estimated_weight, notes, status

**Vista:**
- Formulario con fecha, hora, tipo de residuo, peso estimado y notas
- Validación de campos requeridos
- Fecha mínima: hoy

**Controlador:**
- Inserta recolección en Supabase
- Notifica éxito/error con toast
- Redirige al dashboard

---

### 2. **Descargar Certificado**
**Ruta:** `/certificado`

**Modelo:**
- Datos del usuario desde AuthContext
- Métricas del dashboard (residuos, CO₂, puntos)

**Vista:**
- Certificado visual con diseño profesional
- Muestra nombre del establecimiento
- Estadísticas principales
- Logo ODS 12

**Controlador:**
- Usa html2canvas para convertir a imagen
- Descarga automática como PNG
- Nombre: `certificado-ods12-{establecimiento}.png`

---

### 3. **Ver Reportes Detallados**
**Ruta:** `/reportes`

**Modelo:**
- Datos mensuales de residuos
- Métricas de impacto ambiental
- Comparativas regionales

**Vista:**
- Tabs: Mensual, Impacto Ambiental, Comparativa
- Tablas con datos históricos
- Gráficos de progreso
- Botón exportar PDF

**Controlador:**
- Renderiza datos estáticos (preparado para API)
- Navegación entre tabs
- Función exportar (preparada)

---

### 4. **Establecer Metas**
**Ruta:** `/metas`

**Modelo:**
- Tabla: `goals`
- Campos: user_id, title, target, current, unit

**Vista:**
- Lista de metas con progreso visual
- Formulario para crear nuevas metas
- Botón eliminar meta
- Progress bar por meta

**Controlador:**
- CRUD de metas (crear, leer, eliminar)
- Actualización de estado local
- Notificaciones de acciones

---

## 🗄️ Base de Datos

### Tablas Creadas:

```sql
-- collections: Recolecciones programadas
-- goals: Metas de sostenibilidad
```

**Ejecutar en Supabase:**
1. Ve a SQL Editor
2. Ejecuta `supabase-tables.sql`

---

## 🔗 Rutas Configuradas

```typescript
/programar-recoleccion  → ScheduleCollection
/certificado            → Certificate
/reportes               → Reports
/metas                  → Goals
```

---

## 🎨 Componentes UI Utilizados

- Button, Card, Input, Label
- Select, Textarea, Progress
- Tabs, TabsList, TabsContent
- Toast notifications

---

## 🚀 Próximos Pasos

1. **Ejecutar script SQL** en Supabase:
   - `supabase-setup.sql` (tabla profiles)
   - `supabase-tables.sql` (tablas collections y goals)

2. **Probar funcionalidades:**
   - Registrar usuario
   - Iniciar sesión
   - Acceder a cada acción rápida

3. **Conectar con datos reales:**
   - Integrar API de recolecciones
   - Sincronizar metas con backend
   - Generar reportes dinámicos

---

## 📦 Dependencias Instaladas

```bash
npm install html2canvas  # Para descargar certificado
```

---

## ✅ Estado de Implementación

- ✅ Programar Recolección (Completo)
- ✅ Descargar Certificado (Completo)
- ✅ Ver Reportes Detallados (Completo)
- ✅ Establecer Metas (Completo)
- ✅ Rutas configuradas
- ✅ Navegación desde Dashboard
- ✅ Scripts SQL creados
