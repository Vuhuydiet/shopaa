import prisma from './index.js';

// import { getHashedPassword } from '../utils/cryptoUtils.js';

async function main() {

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
