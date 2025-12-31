import { User, UserWithoutPassword } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = "your-secret-key"; // TODO: use env var

export class UserService {
  async getAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await prisma.user.findMany();
    return users.map(({ password, ...user }: User) => user);
  }

  async getUserById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: UserWithoutPassword } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
