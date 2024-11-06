import crypto from 'crypto';

import prisma from '../prisma';

// Generate RSA key pair
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
      const keys = await prisma.$transaction(async (tx) => {
        return tx.key.createMany({
          data: [
            { keyName: 'JWT_PUBLIC_KEY', value: publicKey },
            { keyName: 'JWT_PRIVATE_KEY', value: privateKey },
          ],
        });
      });

      if (keys.count !== 2) {
        console.error('Error saving keys to database');
        return;
      }

      console.log('Keys generated and saved to database');
    } catch (err: any) {
      console.error('Error saving keys to database: ', err.message);
    }
  },
);
