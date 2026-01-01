import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, UserWithoutPassword } from "@models/user.model.js";
import { AppError } from "../utils/app-error.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

// In-memory user storage
const users: User[] = [];

export class AuthService {
  // 1. Generate Token
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1d" });
  }

  private removePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 2. Signup
  async signup(data: { email: string; password: string; name: string }) {
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      createdAt: new Date(),
    };

    users.push(newUser);
    const token = this.generateToken(newUser.id);
    return { user: this.removePassword(newUser), token };
  }

  // 3. Login
  async login(data: { email: string; password: string }) {
    const user = users.find((u) => u.email === data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken(user.id);
    return { user: this.removePassword(user), token };
  }

  async getUserById(userId: string): Promise<UserWithoutPassword | null> {
    const user = users.find((u) => u.id === userId);
    return user ? this.removePassword(user) : null;
  }
}
