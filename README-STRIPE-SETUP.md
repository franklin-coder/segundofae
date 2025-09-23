
# Configuración de Stripe - Guía de Solución de Problemas

## Problemas Resueltos

### 1. Error: "Neither apiKey nor config.authenticator provided"

**Causa:** Las variables de entorno de Stripe no se están cargando correctamente.

**Solución implementada:**
- Refactorización de `lib/stripe.ts` con manejo de errores mejorado
- Verificación de variables de entorno en tiempo de ejecución
- Funciones separadas para cliente y servidor (`getStripe()` y `getStripeServer()`)

### 2. Errores de Content Security Policy (CSP)

**Causa:** Stripe requiere directivas específicas de CSP para cargar recursos externos.

**Solución implementada:**
- Nuevo archivo `middleware.ts` con configuración CSP completa
- Directivas específicas para Stripe:
  - `script-src`: Permite scripts de Stripe con nonces
  - `style-src`: Permite estilos inline y de Google Fonts
  - `font-src`: Permite fuentes de Google Fonts
  - `connect-src`: Permite conexiones a APIs de Stripe
  - `frame-src`: Permite iframes de Stripe
  - `worker-src`: Permite web workers de Stripe

### 3. Configuración de Next.js mejorada

**Mejoras implementadas:**
- Headers de seguridad adicionales en `next.config.js`
- Optimización de paquetes de Stripe
- Configuración de dominios de imágenes para Stripe

## Variables de Entorno Requeridas

Asegúrate de tener estas variables configuradas:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..." # o sk_live_... para producción
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # o pk_live_... para producción
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Verificación de la Configuración

### 1. Verificar variables de entorno
```bash
# En desarrollo
echo $STRIPE_SECRET_KEY
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# En el navegador (solo la pública debería estar disponible)
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
```

### 2. Verificar CSP headers
Abre las herramientas de desarrollador y verifica que no hay errores de CSP en la consola.

### 3. Probar el flujo de pago
1. Navega a la página de checkout
2. Verifica que el formulario de Stripe se carga correctamente
3. Usa una tarjeta de prueba: `4242 4242 4242 4242`

## Tarjetas de Prueba de Stripe

Para testing, usa estas tarjetas:

- **Éxito:** 4242 4242 4242 4242
- **Requiere autenticación:** 4000 0025 0000 3155
- **Declinada:** 4000 0000 0000 0002

## Deployment

### Vercel
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
```

### Otras plataformas
Asegúrate de configurar las variables de entorno en tu plataforma de deployment.

## Troubleshooting

### Si sigues viendo errores de API key:
1. Verifica que las variables estén configuradas correctamente
2. Reinicia el servidor de desarrollo
3. Verifica que no hay espacios extra en las variables
4. Para producción, usa las claves `live` en lugar de `test`

### Si hay errores de CSP:
1. Verifica que el middleware se está ejecutando
2. Revisa la consola del navegador para errores específicos
3. Ajusta las directivas CSP según sea necesario

### Si el webhook no funciona:
1. Configura el endpoint en el dashboard de Stripe: `/api/stripe-webhook`
2. Verifica que `STRIPE_WEBHOOK_SECRET` esté configurado
3. Para desarrollo local, usa Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`

## Contacto

Si encuentras problemas adicionales, revisa:
1. [Documentación de Stripe](https://stripe.com/docs)
2. [Logs del servidor](para errores de backend)
3. [Consola del navegador](para errores de frontend)
