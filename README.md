# EcoSwipe — Prototipo

Marketplace circular de retazos y saldos textiles para talleres y confeccionistas en Gamarra. Construido con React, Vite y Tailwind CSS siguiendo el Brandbook oficial y especificaciones de accesibilidad WCAG 2.1 AA.

## Prototipo
Este proyecto es una versión prototipo navegable y de alta fidelidad:
- **Datos de ejemplo**: Todos los lotes, métricas y tiendas provienen de datos locales de prueba estructurados en `src/data/` (`lotes.json`, `tiendas.json`, `impactoConfig.json`).
- **Acciones demostrativas**: Los botones de acción transaccional, tales como el modal de contraoferta y el flujo de confirmación de entrega ("Entregué" / trato cerrado), son de carácter demostrativo para ilustrar la experiencia de usuario y la interacción de la mascota Swipee sin alterar una base de datos persistente.

## Despliegue en Vercel
El proyecto incluye `vercel.json` configurado para manejar el enrutamiento SPA mediante reescrituras a `/index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Requisitos y Ejecución Local
- **Node.js**: v18+ (o superior)

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Construir para producción y previsualizar:
   ```bash
   npm run build
   npm run preview
   ```
