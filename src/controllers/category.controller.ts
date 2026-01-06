import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service.js";
import { AppError } from "../utils/app-error.js";
import { createCategorySchema } from "../validations/category.validation.js";

const categoryService = new CategoryService();

export class CategoryController {
  // 1. GET ALL
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  // 2. GET ONE
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryById(req.params.id!);
      if (!category) return next(new AppError("Category not found", 404));
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  // 3. CREATE (Protected)
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const newCategory = await categoryService.createCategory(
        validatedData.name
      );
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }

  // 4. DELETE (Protected)
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.deleteCategory(req.params.id!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
