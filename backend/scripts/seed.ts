import genKey from './generateKeyPair.js';
import prisma from '../models/index.js';

// import { getHashedPassword } from '../utils/cryptoUtils.js';

async function main() {
  console.log('Start seeding ...');

  await genKey();


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
