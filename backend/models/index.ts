import { PrismaClient } from '@prisma/client';
import config from '../configs/db.config';

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: config.MAX_WAIT,
    timeout: config.TIMEOUT,
  },
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
