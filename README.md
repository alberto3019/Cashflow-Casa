# App Pagos de la Casa

Aplicación web para gestionar los pagos compartidos entre Alberto y Victoria.

## Características

- 📊 Dashboard personal para cada usuario
- 💰 Registro de ingresos y egresos
- 📈 Gráficos individuales y de la casa
- 💵 Control de efectivo y tarjetas
- 📱 Diseño responsive para móvil y desktop
- 🔄 Sin necesidad de login, solo selección de perfil
- 💾 Almacenamiento local (localStorage)

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- date-fns (manejo de fechas)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Despliega con un clic

## Configuración de Firebase (Sincronización entre dispositivos)

Para que los datos se sincronicen entre todos tus dispositivos, necesitas configurar Firebase:

1. **Crea un proyecto en Firebase:**
   - Ve a https://console.firebase.google.com/
   - Crea un nuevo proyecto (o usa uno existente)
   - Nombre sugerido: "cashflow-casa"

2. **Habilita Firestore:**
   - En el menú lateral, ve a "Firestore Database"
   - Haz clic en "Crear base de datos"
   - Selecciona "Modo de prueba" (para empezar)
   - Elige una ubicación (ej: us-central)

3. **Obtén las credenciales:**
   - Ve a Configuración del proyecto (⚙️) > Configuración general
   - Baja hasta "Tus aplicaciones"
   - Haz clic en el ícono de web (</>)
   - Copia los valores de configuración

4. **Configura las variables de entorno:**
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Agrega las siguientes variables (reemplaza con tus valores):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

5. **Configura en Vercel:**
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega las mismas variables con el prefijo `NEXT_PUBLIC_`
   - Vuelve a desplegar

**Nota:** Si no configuras Firebase, la app funcionará solo con localStorage (datos locales por dispositivo). Con Firebase configurado, los datos se sincronizarán automáticamente entre todos tus dispositivos.

## Uso

1. Selecciona tu perfil (Alberto o Victoria)
2. Navega por el dashboard para ver tus movimientos
3. Agrega nuevos ingresos o gastos
4. Visualiza gráficos y estadísticas
5. Cambia de mes para ver historial

