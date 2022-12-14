import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const capitalizeFirstLetter = ([first = "", ...rest]: string) =>
  [first.toUpperCase(), ...rest].join("");

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

async function main() {
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customer.create({
      data: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: `${faker.address.streetAddress(true)}`,
        telephone: faker.phone.number(),
        cellphone: faker.phone.number(),
        email: faker.internet.email(),
        jobs: {
          create: Array.from({ length: getRandomInt(1, 5) }, () => ({
            name: capitalizeFirstLetter(faker.lorem.words()),
            startDate: faker.date.recent(10),
            endDate: faker.date.future(5),
            address: faker.address.streetAddress(true),
            description: faker.lorem.paragraph(),
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
