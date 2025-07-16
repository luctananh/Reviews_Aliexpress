// import { PrismaClient } from "@prisma/client";

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.__db) {
//     global.__db = new PrismaClient();
//     global.__db.$connect();
//   }
//   prisma = global.__db;
// }

// export { prisma };



const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  //change to reference a table in your schema
  const val = await prisma.production.findMany({
    take: 10,
  });
  console.log(val);
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