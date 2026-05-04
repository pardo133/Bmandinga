import { registerUser, loginService, userInfoService } from '../services/userService.js';

export const register = async (req, res) => {
    const result = await registerUser(req.body);
    return res.status(result.status).json(result);
};

export const loginController = async (req, res) => {
    const result = await loginService(req.body);
    return res.status(result.status).json(result);
};

export const userInfoController = async (req, res) => {
    const result = await userInfoService(req.user);
    return res.status(result.status).json(result);
};