import * as userService from '../service/userService.js';

export const register = async (req, res) => {
    const { status, ...body } = await userService.registerUser(req.body);
    res.status(status).json(body);
};

export const loginController = async (req, res) => {
    const { status, ...body } = await userService.loginService(req.body);
    res.status(status).json(body);
};

export const userInfoController = async (req, res) => {
    const { status, ...body } = await userService.userInfoService(req.user);
    res.status(status).json(body);
};

export const updateProfileController = async (req, res) => {
    const { status, ...body } = await userService.updateProfile(req.user.id, req.body);
    res.status(status).json(body);
};

export const refreshTokenController = async (req, res) => {
    const { status, ...body } = await userService.refreshTokenService(req.user.id);
    res.status(status).json(body);
};
