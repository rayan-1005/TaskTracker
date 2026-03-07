const { z } = require("zod");

const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Must be a valid email address")
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Must be a valid email address")
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" }),
});

const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot exceed 255 characters")
    .trim(),
  description: z.string().max(1000).trim().optional(),
  status: z.enum(["pending", "completed"]).optional().default("pending"),
});

const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(255).trim().optional(),
    description: z.string().max(1000).trim().optional().nullable(),
    status: z.enum(["pending", "completed"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
};
