import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserWithoutPassword } from "@models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export class AuthService {
  // 1. Generate Token
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
  }

  private removePassword(user: any): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 2. Signup
  async signup(data: { email: string; password: string; name: string }) {
    // 1. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // 3. Create user
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      // Optional: specifically select fields to return to avoid getting large arrays back
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // We skip 'password', 'orders', and 'products' here
      },
    });

    // 4. Generate Token
    const token = this.generateToken(newUser.id);

    // 5. Return (Note: since we used 'select' above, we don't even need removePassword!)
    return { user: newUser, token };
  }

  // 3. Login
  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id);
    return { user: this.removePassword(user), token };
  }

  async getUserById(userId: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user ? this.removePassword(user) : null;
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        orders: true,
        products: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
