import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export class AuthService {
  // 1. Generate Token
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
  }

  // 2. Signup
  async signup(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  // 3. Login
  async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }
}
