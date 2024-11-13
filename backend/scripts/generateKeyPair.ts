import fs from 'fs';
import path from 'path';

import crypto from 'crypto';

// Generate RSA key pair
function genKey() {
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
    (err, publicKey, privateKey) => {
      if (err) {
        console.error('Error generating key pair: ', err);
        return;
      }

      if (!process.env.JWT_PUBLIC_KEY || !process.env.JWT_PRIVATE_KEY) {
        fs.appendFileSync(
          path.join(import.meta.dirname, '../../.env'), 
          `JWT_PUBLIC_KEY=${publicKey}\n\nJWT_PRIVATE_KEY=${privateKey}\n`
        );
      }

      console.log('JWT keys generated successfully');

    },
  );
}

genKey();