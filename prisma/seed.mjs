import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const capitalizeFirstLetter = ([first = "", ...rest]: string) =>
  [first.toUpperCase(), ...rest].join("");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

async function main() {
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.name.fullName(),
        jobs: {
          create: Array.from({ length: getRandomInt(1, 5) }, () => ({
            name: capitalizeFirstLetter(faker.lorem.words()),
          })),
        },
      },
    });

    console.log(customer);
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
