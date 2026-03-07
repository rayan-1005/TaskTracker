const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middleware/auth.js");

router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  userController.getAllUsers,
);

router.get("/:id", authMiddleware.authenticate, userController.getUserById);

router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  userController.deleteUser,
);

module.exports = router;
