import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'mi_clave_secreta_123';

export const createToken = (userData) => {
    return jwt.sign(userData, secret, { expiresIn: '1h' });
};

// Nueva función para verificar si el token es real y no ha expirado
export const validateToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};