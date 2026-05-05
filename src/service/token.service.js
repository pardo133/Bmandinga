import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'mi_clave_secreta_123';

export const createToken = (userData) => {
    
    const payload = { 
        id: userData._id, 
        nombre: userData.nombre,
        correo: userData.correo ,
        role: userData.role
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};


export const validateToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};
