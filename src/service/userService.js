import User from '../models/user.model.js';
import { createToken } from './token.service.js';
import bcrypt from 'bcrypt';

export const registerUser = async (userData) => {
    try {
        const { password, ...rest } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = new User({ ...rest, password: hashedPassword });
        await nuevoUsuario.save();

        return { status: 201, message: "Usuario registrado con éxito" };
    } catch (e) {
        
        if (e.code === 11000) {
            return { status: 409, message: "El correo ya está registrado" };
        }
        return { status: 400, message: "Error al registrar el usuario" };
    }
};

export const loginService = async ({ correo, password }) => {
    try {
        const userFound = await User.findOne({ correo });
        if (!userFound) {
            return { status: 404, message: "Usuario no encontrado" };
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return { status: 401, message: "Contraseña incorrecta" };
        }

        const token = createToken(userFound.toObject());

        return {
            status: 200,
            token,
            user: {
                _id:      userFound._id,
                nombre:   userFound.nombre,
                apellido: userFound.apellido,
                correo:   userFound.correo,
                role:     userFound.role,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error en el login" };
    }
};

export const userInfoService = async (userData) => {
    try {
        return {
            status: 200,
            user: {
                id:      userData.id,
                nombre:  userData.nombre,
                correo:  userData.correo,
                role:    userData.role,
            },
        };
    } catch {
        return { status: 500, message: "Error en el servicio de información" };
    }
};


export const refreshTokenService = async (userId) => {
    try {
        const userFound = await User.findById(userId);
        if (!userFound) return { status: 404, message: 'Usuario no encontrado' };
        const token = createToken(userFound.toObject());
        return { status: 200, token };
    } catch {
        return { status: 500, message: 'Error al renovar el token' };
    }
};


export const updateProfile = async (userId, updateData) => {
    try {
       
        const { correo, password, role, _id, ...allowedFields } = updateData;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: allowedFields },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedUser) {
            return { status: 404, message: "Usuario no encontrado" };
        }

        return {
            status: 200,
            user: {
                _id:        updatedUser._id,
                nombre:     updatedUser.nombre,
                apellido:   updatedUser.apellido,
                correo:     updatedUser.correo,
                address:    updatedUser.address,
                city:       updatedUser.city,
                postalCode: updatedUser.postalCode,
                country:    updatedUser.country,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Error al actualizar el perfil" };
    }
};
