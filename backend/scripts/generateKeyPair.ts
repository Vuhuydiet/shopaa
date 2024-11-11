import crypto from 'crypto';

import prisma from '../models';

// Generate RSA key pair
async function genKey() {
  crypto.generateKeyPair(
    'rsa',
    {
      modulusLength: 2048, // Key size in bits
      publicKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem', // "Privacy-Enhanced Mail"
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    },
    async (err, publicKey, privateKey) => {
      if (err) {
        console.error('Error generating key pair: ', err);
        return;
      }

      try {
        const created = await prisma.$transaction(async (tx) => {
          const pubKey = await tx.key.findUnique({
            where: { name: 'JWT_PUBLIC_KEY' },
          });
          const privKey = await tx.key.findUnique({
            where: { name: 'JWT_PRIVATE_KEY' },
          });

          if (pubKey && privKey)
            return true;

          const { count } = await tx.key.createMany({
            data: [
              { name: 'JWT_PUBLIC_KEY', value: publicKey },
              { name: 'JWT_PRIVATE_KEY', value: privateKey },
            ],
          });
          return count == 2;
        });

        if (!created) {
          console.error('Error saving keys to database');
          return;
        }

        console.log('JWT keys generated and saved to database');
      } catch (err: any) {
        console.error('Error saving keys to database: ', err.message);
      }
    },
  );
}

export default genKey;