
# 🚀 Guía Completa de Configuración de Stripe para FaeLight Crafts

Esta guía te ayudará a configurar completamente Stripe en tu aplicación de e-commerce. Sigue estos pasos en orden para tener todo funcionando.

## 📋 Requisitos Previos

- Cuenta de Stripe (crear en [stripe.com](https://stripe.com))
- Acceso al dashboard de Vercel (donde está desplegada tu app)
- Acceso a tu repositorio de GitHub

## 🔧 Paso 1: Configuración de Stripe Dashboard

### 1.1 Crear Cuenta y Obtener Claves API

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Inicia sesión o crea una cuenta nueva
3. Ve a **Developers > API keys**
4. Copia las siguientes claves:
   - **Publishable key** (pk_test_... para test mode)
   - **Secret key** (sk_test_... para test mode)

### 1.2 Configurar Webhooks

1. En Stripe Dashboard, ve a **Developers > Webhooks**
2. Haz clic en **"Add endpoint"**
3. Configura el endpoint:
   - **Endpoint URL**: `https://tu-dominio.vercel.app/api/stripe-webhook`
   - **Description**: "FaeLight Crafts Order Processing"
4. Selecciona los siguientes eventos:
   ```
   payment_intent.succeeded
   payment_intent.payment_failed
   payment_intent.canceled
   payment_intent.requires_action
   charge.succeeded
   charge.failed
   invoice.payment_succeeded
   customer.created
   ```
5. Haz clic en **"Add endpoint"**
6. Copia el **Signing secret** (whsec_...)

### 1.3 Configurar Información de Negocio

1. Ve a **Settings > Business settings**
2. Completa:
   - **Business name**: FaeLight Crafts
   - **Business type**: Individual/Company (según corresponda)
   - **Industry**: Retail - Jewelry
   - **Website**: tu-dominio.vercel.app

## 🌐 Paso 2: Configuración en Vercel

### 2.1 Variables de Entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings > Environment Variables**
3. Agrega las siguientes variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# Database (si no está configurada)
DATABASE_URL=tu_database_url_aqui

# NextAuth (si no está configurada)
NEXTAUTH_SECRET=tu_secret_key_muy_segura_aqui
NEXTAUTH_URL=https://tu-dominio.vercel.app

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
FROM_EMAIL=noreply@tu-dominio.com

# Admin Configuration
ADMIN_EMAIL=tu-email@gmail.com
```

### 2.2 Redesplegar la Aplicación

1. Después de agregar las variables, Vercel redesplegará automáticamente
2. O puedes forzar un redespliegue yendo a **Deployments** y haciendo clic en **"Redeploy"**

## 🧪 Paso 3: Pruebas en Modo Test

### 3.1 Tarjetas de Prueba de Stripe

Usa estas tarjetas para probar diferentes escenarios:

```bash
# Pago exitoso
4242 4242 4242 4242

# Pago declinado
4000 0000 0000 0002

# Requiere autenticación 3D Secure
4000 0025 0000 3155

# Fondos insuficientes
4000 0000 0000 9995

# Tarjeta expirada
4000 0000 0000 0069
```

**Datos adicionales para pruebas:**
- **Fecha de expiración**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier 3 dígitos (ej: 123)
- **Código postal**: Cualquier código válido (ej: K1A 0A6)

### 3.2 Flujo de Prueba Completo

1. Ve a tu sitio web
2. Agrega productos al carrito
3. Ve al checkout
4. Completa la información de envío
5. Usa una tarjeta de prueba para el pago
6. Verifica que:
   - El pago se procesa correctamente
   - Recibes la confirmación
   - El webhook se ejecuta (revisa logs en Vercel)

## 📊 Paso 4: Monitoreo y Logs

### 4.1 Verificar Webhooks

1. En Stripe Dashboard, ve a **Developers > Webhooks**
2. Haz clic en tu endpoint
3. Ve a la pestaña **"Recent deliveries"**
4. Verifica que los webhooks se están entregando correctamente (status 200)

### 4.2 Revisar Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Functions > View Function Logs**
3. Busca logs de las rutas:
   - `/api/create-payment-intent`
   - `/api/confirm-payment`
   - `/api/stripe-webhook`

## 🚀 Paso 5: Pasar a Producción

### 5.1 Activar Cuenta de Stripe

1. En Stripe Dashboard, completa la información requerida para activar tu cuenta
2. Proporciona información bancaria para recibir pagos
3. Verifica tu identidad según los requisitos de Stripe

### 5.2 Cambiar a Claves de Producción

1. En Stripe Dashboard, cambia de **Test mode** a **Live mode**
2. Ve a **Developers > API keys**
3. Copia las nuevas claves (pk_live_... y sk_live_...)
4. Actualiza las variables de entorno en Vercel:
   ```bash
   STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_de_produccion
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica_de_produccion
   ```

### 5.3 Actualizar Webhook para Producción

1. Crea un nuevo webhook endpoint para producción
2. Usa la misma URL pero con las claves de producción
3. Actualiza `STRIPE_WEBHOOK_SECRET` con el nuevo signing secret

## 🔒 Paso 6: Seguridad y Mejores Prácticas

### 6.1 Verificaciones de Seguridad

- ✅ Las claves secretas nunca se exponen en el frontend
- ✅ Los webhooks verifican la firma de Stripe
- ✅ Los pagos se confirman en el servidor
- ✅ Las variables de entorno están configuradas correctamente

### 6.2 Monitoreo Continuo

1. Configura alertas en Stripe para pagos fallidos
2. Revisa regularmente los logs de Vercel
3. Monitorea las métricas de conversión en Stripe Dashboard

## 🆘 Solución de Problemas Comunes

### Error: "No such payment_intent"
- Verifica que las claves de API sean correctas
- Asegúrate de estar en el mismo modo (test/live) en todas partes

### Webhook no se ejecuta
- Verifica que la URL del webhook sea correcta
- Revisa que el signing secret sea el correcto
- Verifica que los eventos estén seleccionados

### Pagos no se procesan
- Revisa los logs de Vercel para errores
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que la base de datos esté conectada

## 📞 Soporte

Si tienes problemas:

1. **Stripe Support**: [support.stripe.com](https://support.stripe.com)
2. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
3. **Documentación de Stripe**: [stripe.com/docs](https://stripe.com/docs)

## ✅ Lista de Verificación Final

- [ ] Cuenta de Stripe creada y verificada
- [ ] Claves API copiadas y configuradas en Vercel
- [ ] Webhook configurado y funcionando
- [ ] Variables de entorno configuradas
- [ ] Aplicación redesplegada
- [ ] Pruebas realizadas con tarjetas de test
- [ ] Logs verificados y sin errores
- [ ] Información de negocio completada en Stripe
- [ ] Listo para producción (opcional)

¡Felicidades! Tu integración de Stripe está completa y lista para procesar pagos. 🎉
