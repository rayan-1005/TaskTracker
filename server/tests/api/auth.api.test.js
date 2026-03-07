jest.mock("../../src/config/db");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../src/config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "7d";
  });

  it("should return 400 for invalid email", async () => {
    const res = request(app)
      .post("/api/v1/auth/register")
      .send({ email: "not-an-email", password: "Password1" });
    expect((await res).statusCode).toBe(400);
  });

  it("should return 201 for successful registration", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_password");
    prisma.user.create.mockResolvedValue({ id: 1, email: "fake@example.com" });
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "fake@example.com", password: "Password1" });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).not.toHaveProperty("password");
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "7d";
  });

  it("should return 401 for invalid credentials", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "fake@example.com", password: "Passwod1" });
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for successful login", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "fake@example.com",
      password: "hashed_password",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake.jwt.token");
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "fake@example.com", password: "Password1" });
    expect(res.body).toHaveProperty("token");
    expect(res.statusCode).toBe(200);
  });
});
