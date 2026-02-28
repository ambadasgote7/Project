import {
  loginService,
  setPasswordService,
  logoutService,
  getMeService
} from "./auth.service.js";

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      data: result.user,
      token: result.token
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const result = await setPasswordService(req.body);

    res.status(200).json({
      message: result.message
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutService(res);

    res.status(200).json({
      message: "Logout successful"
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user);

    res.status(200).json({
      message: "User fetched successfully",
      data: user
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};