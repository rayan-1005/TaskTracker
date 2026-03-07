jest.mock("../../src/config/db");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const authService = require("../../src/services/auth.service");
const prisma = require("../../src/config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("authService.register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "7d";
  });

  it("should return 409 if email is already registered", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      id: "fake-id",
      email: "fake@example.com",
    });
    await expect(
      authService.register({
        email: "fake@example.com",
        password: "Password1",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email already in use",
    });
  });

  it("should hash the password before saving", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue("hashed-password");
    prisma.user.create = jest.fn().mockResolvedValue({
      id: "new-user-id",
      email: "fake@example.com",
      password: "hashed-password",
      role: "user",
    });
    await authService.register({
      email: "fake@example.com",
      password: "Password1",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("Password1", 10);
  });

  it("should return user data without password", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);
    bcrypt.hash = jest.fn().mockResolvedValue("hashed-password");
    prisma.user.create = jest.fn().mockResolvedValue({
      id: "new-user-id",
      email: "fake@example.com",
    });
    const user = await authService.register({
      email: "fake@example.com",
      password: "Password1",
    });
    expect(user).not.toHaveProperty("password");
  });
});
