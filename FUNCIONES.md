# Qué hace cada función

## token.service.js

**`createToken(userData)`** — coge datos del usuario y hace token JWT. Token dura 2h.

**`validateToken(token)`** — comprueba si token es bueno. Si no → null.

---

## user.middleware.js

**`authMiddleware`** — portero. Lee token del header, lo valida. Si malo → 401. Si bueno → deja pasar y mete usuario en `req.user`.

---

## userService.js

**`registerUser(userData)`** — coge datos, encripta contraseña, guarda usuario en BD. Si correo repetido → 409.

**`loginService({correo, password})`** — busca usuario por correo, compara contraseña. Si todo bien → devuelve token + datos usuario.

**`userInfoService(userData)`** — devuelve id, nombre, correo y rol del usuario logueado.

**`refreshTokenService(userId)`** — busca usuario en BD y genera token nuevo. Para renovar sesión sin volver a hacer login.

**`updateProfile(userId, updateData)`** — actualiza datos del perfil. No deja cambiar correo, contraseña ni rol.

---

## userController.js

Capa fina entre rutas y servicios. Cada función llama a su servicio y devuelve la respuesta.

| Controller | Llama a |
|---|---|
| `register` | `registerUser` |
| `loginController` | `loginService` |
| `userInfoController` | `userInfoService` |
| `updateProfileController` | `updateProfile` |
| `refreshTokenController` | `refreshTokenService` |

---

## user.routes.js

| Método | Ruta | Protegida | Qué hace |
|---|---|---|---|
| POST | `/register` | No | Crear cuenta |
| POST | `/login` | No | Entrar |
| GET | `/info` | Sí | Ver tu info |
| PUT | `/profile` | Sí | Editar perfil |
| GET | `/refresh` | Sí | Token nuevo |
