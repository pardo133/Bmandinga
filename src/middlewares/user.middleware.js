import { validateToken } from '../service/token.service.js';

export function authMiddleware(req, res, next) {
    // Buscamos el token en el header (formato: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).send("Token inexistente");
    }

    const userPayload = validateToken(token);

    if (!userPayload) {
        return res.status(401).send("Error de token"); // Esto verás en Postman
    }

    // Guardamos los datos del usuario en la petición por si los necesitas
    req.user = userPayload;
    next();
}