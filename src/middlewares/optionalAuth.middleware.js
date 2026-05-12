import { validateToken } from '../service/token.service.js';

export function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const userPayload = validateToken(token);
    if (userPayload) req.user = userPayload;
  }

  next();
}
