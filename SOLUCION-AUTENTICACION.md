# Solución a Problemas de Autenticación y Registro

## Problemas Identificados y Corregidos

### 1. **Pantalla en Blanco en Dashboard**
- **Causa**: El Dashboard se renderizaba antes de verificar la autenticación
- **Solución**: Agregado loader mientras se verifica la sesión

### 2. **Usuarios No Se Registran**
- **Causa**: Posible falta de tabla `profiles` en Supabase o políticas RLS incorrectas
- **Solución**: Script SQL para crear la tabla con políticas correctas

### 3. **Sesión No Persiste**
- **Causa**: Redirección antes de establecer la sesión completamente
- **Solución**: Agregado delay y mejor manejo de estados

## Pasos para Solucionar

### Paso 1: Configurar Supabase

1. Ve a tu proyecto en Supabase: https://ucyjndfofvvqosjnrfyp.supabase.co
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `supabase-setup.sql`
4. Ejecuta el script (botón "Run")

### Paso 2: Verificar Configuración de Email

En Supabase, ve a **Authentication > Settings**:

- **Enable Email Confirmations**: 
  - Si está activado, los usuarios deben confirmar su email antes de iniciar sesión
  - Para desarrollo, puedes desactivarlo temporalmente
  
- **Configuración recomendada para desarrollo**:
  - Desactiva "Enable email confirmations"
  - Esto permite registro e inicio de sesión inmediato

### Paso 3: Probar el Sistema

1. **Limpiar datos anteriores**:
   ```bash
   # Limpiar localStorage del navegador
   # Abrir DevTools (F12) > Console > ejecutar:
   localStorage.clear()
   ```

2. **Registrar nuevo usuario**:
   - Ve a `/registro`
   - Completa todos los campos
   - Observa la consola del navegador para ver logs

3. **Iniciar sesión**:
   - Ve a `/login`
   - Usa las credenciales registradas
   - Deberías ser redirigido al dashboard

## Verificación de Errores

### En el Navegador (DevTools - Console):

Busca estos mensajes:
- ✅ "Starting registration for: [email]"
- ✅ "SignUp response: { authData: {...}, authError: null }"
- ✅ "Profile insert result: { profileError: null }"
- ✅ "Auth event: SIGNED_IN"

### Errores Comunes:

1. **"relation 'profiles' does not exist"**
   - Ejecuta el script SQL en Supabase

2. **"new row violates row-level security policy"**
   - Verifica que las políticas RLS estén creadas correctamente

3. **"Invalid login credentials"**
   - Verifica que el email y contraseña sean correctos
   - Si acabas de registrarte, espera unos segundos

4. **Pantalla en blanco después de login**
   - Abre DevTools y revisa errores en Console
   - Verifica que el perfil se haya creado en Supabase

## Verificar en Supabase

1. **Tabla Profiles**:
   - Ve a **Table Editor > profiles**
   - Verifica que los usuarios registrados aparezcan aquí

2. **Authentication**:
   - Ve a **Authentication > Users**
   - Verifica que los usuarios estén en la lista

3. **Logs**:
   - Ve a **Logs > Postgres Logs**
   - Busca errores relacionados con la tabla profiles

## Cambios Realizados en el Código

### AuthContext.tsx
- ✅ Mejor manejo de errores en registro y login
- ✅ Validación de sesión y perfil antes de continuar
- ✅ Rollback si falla la creación del perfil

### Dashboard.tsx
- ✅ Agregado loader mientras se verifica autenticación
- ✅ Prevención de renderizado antes de verificar sesión
- ✅ Redirección solo después de verificar estado

### Register.tsx
- ✅ Delay antes de redirigir para permitir establecer sesión
- ✅ Mejor manejo de estados de carga

## Contacto y Soporte

Si los problemas persisten:
1. Revisa los logs en la consola del navegador
2. Verifica los logs en Supabase
3. Asegúrate de que las variables de entorno estén correctas en `.env`
