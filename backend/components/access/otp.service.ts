
import emailService, { Email } from '../../externalServices/email/email.service';
import { generateOtp } from '../../libraries/utils/random';

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
    this.invalidate();
    if (!this.m_OtpStorage[clientEmail])
      return false;
    return this.m_OtpStorage[clientEmail].otp == otp;
  }

  static invalidate() {
    for (const clientEmail in this.m_OtpStorage) {
      if (this.m_OtpStorage[clientEmail].exp < Date.now()) {
        delete this.m_OtpStorage[clientEmail];
      }
    }
  }
}

async function sendOtpEmail(clientEmail: string) {
  const otp = generateOtp();
  OtpStorage.storeOtp(clientEmail, otp);

  const mailOptions: Email = {
    subject: 'Your OTP Code',
    text: `
        Hello,

        Your OTP code is: ${otp}\n
        Please enter this code to proceed.
        
        Thank you!
      `,
  };

  await emailService.send(clientEmail, mailOptions);
}

function validateOtp(clientEmail: string, otp: number) {
  return OtpStorage.validate(clientEmail, otp);
}

export default { sendOtpEmail, validateOtp };