import KeyService from "../services/key.service";

// JWT KEYS
const jwtPublicKey = await KeyService.getKey('JWT_PUBLIC_KEY');
if (!jwtPublicKey) {
  throw new Error('JWT_PUBLIC_KEY is not defined');
}

const jwtPrivateKey = await KeyService.getKey('JWT_PRIVATE_KEY');
if (!jwtPrivateKey) {
  throw new Error('JWT_PRIVATE_KEY is not defined');
}

// GOOGLE OAUTH KEYS
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials are not defined in the environment variables');
}

// FACEBOOK OAUTH KEYS
if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error('Facebook OAuth credentials are not defined in the environment variables');
}

// GMAIL
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error('Email credentials are not defined in the environment variables');
}


export default {
  JWT_PUBLIC_KEY: jwtPublicKey.value,
  JWT_PRIVATE_KEY: jwtPrivateKey.value,
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

}