import dotenv from 'dotenv';
dotenv.config();

// JWT KEYS
if (!process.env.JWT_PUBLIC_KEY || !process.env.JWT_PRIVATE_KEY) {
  throw new Error('JWT keys are not defined in the environment variables');
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

// CLOUDINARY
if (!process.env.CLOUDINARY_URL) {
  throw new Error('Cloudinary URL is not defined in the environment variables');
}

export default {
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
}