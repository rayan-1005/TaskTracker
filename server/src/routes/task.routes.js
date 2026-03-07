const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/", authMiddleware.authenticate, taskController.createTask);
router.get("/", authMiddleware.authenticate, taskController.getTasks);
router.put("/:id", authMiddleware.authenticate, taskController.updateTask);
router.delete("/:id", authMiddleware.authenticate, taskController.deleteTask);

module.exports = router;
