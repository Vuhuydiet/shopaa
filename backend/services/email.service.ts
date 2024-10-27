import keyConfig from '../configs/key.config';
import nodemailer from 'nodemailer';
import { generateOtp } from '../utils/ramdom';


type Record = {
  otp: number,
  exp: number,
};

class OtpStorage {
  private static readonly EXPIRES_IN = 5; // minutes
  private static m_OtpStorage: { [key: string]: Record } = {};

  static storeOtp(clientEmail: string, otp: number) {
    this.m_OtpStorage[clientEmail] = {
      otp: otp, 
      exp: Date.now() + (this.EXPIRES_IN * 60 * 1000),
    };
  }

  static validate(clientEmail: string, otp: number) {
    if (!this.m_OtpStorage[clientEmail] || this.m_OtpStorage[clientEmail].exp < Date.now()) {
      delete this.m_OtpStorage[clientEmail];
      return false;
    }
    return this.m_OtpStorage[clientEmail].otp == otp;
  }
}

// Send OTP via email using Nodemailer
async function sendOtpEmail(clientEmail: string) {
  const transporter = nodemailer.createTransport({
    // host: keyConfig.SMTP_HOST,
    // port: keyConfig.SMTP_PORT,
    service: 'Gmail',
    // secure: true, // true for 465, false for other ports
    auth: {
      user: keyConfig.EMAIL_USER,
      pass: keyConfig.EMAIL_PASSWORD,
    },
  });

  // Email details
  const otp = generateOtp();
  OtpStorage.storeOtp(clientEmail, otp);

  const mailOptions = {
    from: keyConfig.EMAIL_USER,
    to: clientEmail,
    subject: 'Your OTP Code',
    text: `
        Hello,

        Your OTP code is: ${otp}\n
        Please enter this code to proceed.
        
        Thank you!
      `,
  };

  await transporter.sendMail(mailOptions);
}

function validateOtp(clientEmail: string, otp: number) {
  return OtpStorage.validate(clientEmail, otp);
}

export default { sendOtpEmail, validateOtp };