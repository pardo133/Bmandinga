---
name: project-admin-panel
description: Panel de administración de productos implementado con acceso por role:admin en MongoDB
metadata:
  type: project
---

Se implementó un panel de administración completo (mayo 2026).

**Backend (Bmandinga):**
- `src/middlewares/admin.middleware.js` — verifica `role === 'admin'` en el JWT
- `src/controllers/productController.js` — CRUD completo (GET, POST, PUT, DELETE)
- `src/routes/product.routes.js` — rutas admin protegidas con authMiddleware + adminMiddleware
- `src/service/userService.js` — `loginService` ahora devuelve `role` en el objeto user

**Frontend (Fmandinga):**
- `src/pages/Admin.tsx` + `Admin.css` — panel completo con CRUD y subida de imagen
- `src/service/productService.ts` — fetchProducts, createProduct, updateProduct, deleteProduct
- `src/pages/Productos.tsx` — reescrito para leer de la API en lugar de datos hardcodeados
- `src/context/UserContext.tsx` — `UserProfile` ahora incluye `role?: string`
- `src/context/CartContext.tsx` — `id` cambiado a `string | number` para soportar ObjectIds de Mongo
- `src/components/Navbar/Navbar.tsx` — enlace "Admin" solo visible si `user.role === 'admin'`
- `src/App.tsx` — ruta `/admin` registrada

**Why:** El TFM requería gestión dinámica de productos desde el front, acceso restringido a admins.
**How to apply:** Para dar acceso admin a un usuario, cambiar manualmente `role` a "admin" en MongoDB.
