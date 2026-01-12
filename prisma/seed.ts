import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("securepassword", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword2,
    },
  });

  console.log({ user1, user2 });

  // Create Categories
  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics" },
  });

  const books = await prisma.category.upsert({
    where: { name: "Books" },
    update: {},
    create: { name: "Books" },
  });

  const homeGoods = await prisma.category.upsert({
    where: { name: "Home Goods" },
    update: {},
    create: { name: "Home Goods" },
  });

  console.log({ electronics, books, homeGoods });

  // Create Products
  const product1 = await prisma.product.upsert({
    where: { id: "prod1" }, // Use a dummy ID for upserting, will be replaced by cuid
    update: {},
    create: {
      id: "prod1", // Temporarily assign an ID for upsert
      name: "Smartphone",
      description: "Latest model smartphone with advanced features.",
      price: 699.99,
      userId: user1.id,
      categoryId: electronics.id,
      imageUrl: "https://example.com/smartphone.jpg",
    },
  });

  const product2 = await prisma.product.upsert({
    where: { id: "prod2" },
    update: {},
    create: {
      id: "prod2",
      name: "Laptop",
      description: "High performance laptop for work and gaming.",
      price: 1200.0,
      userId: user1.id,
      categoryId: electronics.id,
      imageUrl: "https://example.com/laptop.jpg",
    },
  });

  const product3 = await prisma.product.upsert({
    where: { id: "prod3" },
    update: {},
    create: {
      id: "prod3",
      name: "The Great Adventure",
      description: "An epic tale of bravery and exploration.",
      price: 25.5,
      userId: user2.id,
      categoryId: books.id,
      imageUrl: "https://example.com/book.jpg",
    },
  });

  console.log({ product1, product2, product3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
