import * as userService from '../service/userService.js';

export const register = async (req, res) => {
    const result = await userService.registerUser(req.body);
    res.status(result.status).json(result);
};

export const loginController = async (req, res) => {
    const result = await userService.loginService(req.body);
    res.status(result.status).json(result);
};

export const userInfoController = async (req, res) => {
    const result = await userService.userInfoService(req.user);
    res.status(result.status).json(result);
};