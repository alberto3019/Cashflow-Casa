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

Los datos se almacenan en localStorage del navegador, por lo que cada dispositivo mantendrá sus propios datos.

## Uso

1. Selecciona tu perfil (Alberto o Victoria)
2. Navega por el dashboard para ver tus movimientos
3. Agrega nuevos ingresos o gastos
4. Visualiza gráficos y estadísticas
5. Cambia de mes para ver historial

