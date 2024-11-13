import prisma from '../models';

async function main() {
  console.log('Start seeding ...');

}

main()
  .then(() => {
    console.log('Database has been seeded!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
