import User from '../models/user.model.js';
import { createToken } from './token.service.js';
import bcrypt from 'bcrypt'; //

export const registerUser = async (userData) => {
    try {
        const { password, ...rest } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const nuevoUsuario = new User({ ...rest, password: hashedPassword });
        await nuevoUsuario.save();
        
        return { status: 201, message: "Usuario guardado" };
    } catch (e) {
        return { status: 409, message: "Error al guardar usuario" };
    }
};

export const loginService = async ({ correo, password }) => {
    try {
        // 1. Buscar al usuario por correo
        const userFound = await User.findOne({ correo });
        if (!userFound) {
            return { status: 404, message: "Usuario no encontrado" };
        }

        // 2. Comparar la contraseña ingresada con la de la DB (userFound.password)
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return { status: 401, message: "Contraseña incorrecta" };
        }

        // 3. Generar el token si todo es correcto
        const token = createToken(userFound.toObject());
        return { status: 200, token };

    } catch (error) {
        console.error(error); // Esto te ayudará a ver errores reales en la consola
        return { status: 500, message: "Error en el login" };
    }
};

export const userInfoService = async (user) => {
    return { status: 200, user };
};