const userService = require("../services/user.service.js");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    if (req.user.role !== "admin" && req.user.id !== user.id) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const checker = req.user.role === "admin";
    if (!checker) {
      const error = new Error("Unauthorized");
      error.statusCode = 403;
      throw error;
    }
    await userService.deleteUser(id);
    res
      .status(200)
      .json({ message: "User deleted successfully", deletedId: id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
};
