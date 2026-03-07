const prisma = require("../config/db.js");

const createTask = async (data, userId) => {
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
    },
  });
  return task;
};

const getTasks = async (user) => {
  if (user.role === "admin") {
    const tasks = await prisma.task.findMany();
    return tasks;
  }
  return await prisma.task.findMany({
    where: {
      userId: user.id,
    },
  });
};

const updateTask = async (id, data, user) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  if (task.userId !== user.id && user.role !== "admin") {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }
  const updatedTask = await prisma.task.update({
    where: { id },
    data,
  });
  return updatedTask;
};

const deleteTask = async (id, user) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  if (task.userId !== user.id && user.role !== "admin") {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }
  await prisma.task.delete({ where: { id } });
  return { id, message: "Task deleted successfully" };
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
