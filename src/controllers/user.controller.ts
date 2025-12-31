import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await userService.getAllUsers();
    res.json(users);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "User id is required" });
      return;
    }
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        res
          .status(400)
          .json({ message: "Name, email, and password are required" });
        return;
      }
      const newUser = await userService.register({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Error registering user" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      const result = await userService.login(email, password);
      if (result) {
        res.json(result);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  }
}
