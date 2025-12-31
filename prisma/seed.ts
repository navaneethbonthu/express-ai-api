import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fakeProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life",
  },
  {
    name: "Smartphone Case",
    price: 24.99,
    description:
      "Protective case for smartphones with shock absorption and anti-scratch coating",
  },
  {
    name: "Laptop Stand",
    price: 45.99,
    description:
      "Adjustable aluminum laptop stand for better ergonomics and cooling",
  },
  {
    name: "USB-C Hub",
    price: 34.99,
    description: "Multi-port USB-C hub with HDMI, USB-A, and Ethernet ports",
  },
  {
    name: "Wireless Mouse",
    price: 29.99,
    description:
      "Ergonomic wireless mouse with customizable DPI and RGB lighting",
  },
  {
    name: "Portable Charger",
    price: 39.99,
    description:
      "20000mAh portable charger with fast charging and multiple USB ports",
  },
  {
    name: "Gaming Keyboard",
    price: 79.99,
    description:
      "Mechanical gaming keyboard with RGB backlighting and programmable keys",
  },
  {
    name: "Webcam HD",
    price: 49.99,
    description: "1080p HD webcam with auto-focus and built-in microphone",
  },
  {
    name: "External SSD Drive",
    price: 119.99,
    description: "500GB external SSD with USB 3.0 for fast data transfer",
  },
  {
    name: "Smart Home Hub",
    price: 69.99,
    description:
      "Voice-controlled smart home hub compatible with major smart devices",
  },
];

async function main() {
  console.log("🌱 Seeding database with fake products...");

  for (const product of fakeProducts) {
    await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log("🎉 Database seeded successfully!");
  console.log(`📊 Added ${fakeProducts.length} products to the database`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
