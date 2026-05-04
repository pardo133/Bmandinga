import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { createToken } from './token.service.js';

export const registerUser = async (userData) => {
    try {
        const { password } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const nuevoUsuario = new User({ ...userData, password: hashedPass });
        await nuevoUsuario.save();
        return { status: 201, message: "usuario guardado" };
    } catch (e) {
        return { status: 409, message: "usuario NO guardado" };
    }
};

export const loginService = async (userData) => {
    try {
        const { correo, password } = userData;
        const userFound = await User.findOne({ correo });
        if (!userFound) return { status: 404, message: "Usuario no encontrado" };
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return { status: 401, message: "Contraseña incorrecta" };
        
        const userInfo = { id: userFound._id, nombre: userFound.nombre, correo: userFound.correo };
        const token = createToken(userInfo);
        return { status: 200, message: "Login exitoso", usuario: userInfo, token };
    } catch (error) {
        return { status: 500, message: "Error en el servidor" };
    }
};

// Exportación fundamental para evitar el error de "not provide an export"
export const userInfoService = async (user) => {
    return { status: 200, message: "Información recuperada", user };
};