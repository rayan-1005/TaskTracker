const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const validate = require("../middleware/validate.js");
const { registerSchema, loginSchema } = require("../validators/schemas.js");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;
