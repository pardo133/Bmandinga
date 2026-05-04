import { validateToken } from '../service/token.service.js';

export function authMiddleware(req, res, next) {
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).send("Token inexistente");
    }

    const userPayload = validateToken(token);

    if (!userPayload) {
        return res.status(401).send("Error de token"); 
    }

   
    req.user = userPayload;
    next();
}