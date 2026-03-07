const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db.js");

const register = async ({ email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  const DUMMY_HASH =
    "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const passwordToCompare = user ? user.password : DUMMY_HASH;
  const isPasswordValid = await bcrypt.compare(password, passwordToCompare);

  if (!user || !isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

module.exports = { register, login };
