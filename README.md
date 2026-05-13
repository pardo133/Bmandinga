# Bmandinga — Backend

API REST para el ecommerce Mandinga 2.0. Node.js + Express + MongoDB + Stripe.

## Stack

- **Runtime**: Node.js con TypeScript (`tsx` en dev, `tsc` en build)
- **Framework**: Express 5
- **Base de datos**: MongoDB vía Mongoose
- **Auth**: JWT + bcrypt
- **Pagos**: Stripe (checkout session + webhook)
- **Subida de archivos**: Multer
- **Deploy**: Vercel (serverless)

## Variables de entorno

Crea un `.env` en la raíz:

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Instalación y arranque

```bash
npm install
npm run dev      # dev con hot-reload
npm run build    # compila a /dist
```

## Endpoints

### Usuarios — `/api/users`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/register` | Registro | No |
| POST | `/login` | Login, devuelve JWT | No |
| GET | `/refresh` | Refresca token | Sí |
| GET | `/session-status` | Estado de sesión | Sí |
| PUT | `/profile` | Actualiza perfil | Sí |

### Productos — `/api/products`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/` | Lista todos los productos | No |
| GET | `/info` | Info adicional | No |
| POST | `/` | Crea producto | Sí |
| PUT | `/:id` | Actualiza producto | Sí |
| DELETE | `/:id` | Elimina producto | Sí |

### Pagos — `/api/payments`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/create` | Crea PaymentIntent | Sí |
| POST | `/simulate-payment` | Simula pago (dev) | No |
| POST | `/webhook` | Webhook de Stripe | — |

### Checkout — `/api/checkout`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/create-checkout-session` | Crea sesión Stripe Checkout | Sí |
| GET | `/session-status` | Estado de la sesión | No |
| POST | `/carrito` | Gestión de carrito | Sí |

## Estructura

```
src/
├── config/       # Conexión a MongoDB
├── controllers/  # Lógica de negocio
├── middlewares/  # Auth JWT
├── models/       # Schemas Mongoose (User, Product)
├── routes/       # Definición de rutas
├── services/     # Lógica reutilizable
└── types/        # Tipos TypeScript
index.js          # Entry point
```

## Notas

- El webhook de Stripe requiere el body en crudo (`express.raw`), registrado **antes** de `express.json()`.
- Las imágenes de productos se sirven estáticamente desde `/uploads`.
- En producción (Vercel) el servidor se exporta como handler serverless desde `index.js`.
