import prisma from './index.js';

// import { getHashedPassword } from '../utils/cryptoUtils.js';

async function main() {
  const user = {
    username: 'vuhuydiet',
    password: 'hihi',
  };

  await prisma.user.upsert({
    create: user,
    update: user,
    where: {
      username: user.username,
    },
  });

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
