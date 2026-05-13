# Pasar Stripe de test a producción

## 1. Activar la cuenta en Stripe

Entrar en [dashboard.stripe.com](https://dashboard.stripe.com) → completar el formulario de activación (datos bancarios, fiscales y de negocio). Hasta que no esté activada, los cobros reales no funcionan.

---

## 2. Obtener las claves de producción

En el Dashboard de Stripe, desactivar el toggle **"Test mode"** (esquina superior derecha).

Ir a **Developers → API keys** y copiar:

| Variable | Empieza por |
|----------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| Clave pública (frontend) | `pk_live_...` |

---

## 3. Actualizar las variables de entorno del backend

En el `.env`:

```env
STRIPE_SECRET_KEY=sk_live_...   # sustituye la sk_test_
```

Si está desplegado en Vercel, actualizar también ahí:

```bash
vercel env add STRIPE_SECRET_KEY production
```

---

## 4. Registrar el webhook de producción

En **Developers → Webhooks → Add endpoint**:

- URL: `https://tu-dominio.com/api/payments/webhook`
- Eventos a escuchar: `checkout.session.completed` (y los que uses)

Stripe generará un nuevo secreto `whsec_live_...`. Actualizar:

```env
STRIPE_WEBHOOK_SECRET=whsec_live_...
```

> En test se usaba la Stripe CLI para reenviar eventos localmente. En producción Stripe llama directamente a la URL del servidor, no hace falta ninguna CLI.

---

## 5. Actualizar la clave pública en el frontend

Donde el frontend inicializa Stripe (normalmente `loadStripe(...)`), sustituir `pk_test_` por `pk_live_`.

---

## Resumen de cambios

| Qué | Test | Producción |
|-----|------|------------|
| Secret key | `sk_test_...` | `sk_live_...` |
| Public key | `pk_test_...` | `pk_live_...` |
| Webhook secret | `whsec_test_...` | `whsec_live_...` |
| Webhook origen | Stripe CLI local | Stripe → URL pública |
| Cobros reales | No | Sí |
