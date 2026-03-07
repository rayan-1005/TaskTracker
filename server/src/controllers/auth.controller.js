const authService = require("../services/auth.service.js");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register({ email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login({ email, password });

    res
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
