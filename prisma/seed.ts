import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

async function main() {
  for (let i = 0; i < 3; i++) {
    await prisma.customer.create({
      data: {
        name: "Juan Pérez",
        jobs: {
          create: Array.from({ length: getRandomInt(1, 3) }, () => ({
            name: "Instalación AC",
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
