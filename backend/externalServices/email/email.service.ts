import nodemailer from 'nodemailer';
import keyConfig from '../../configs/key.config';

type Email = {
  subject: string,
  text: string,
}

class EmailService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // host: keyConfig.SMTP_HOST,
      // port: keyConfig.SMTP_PORT,
      service: 'Gmail',
      // secure: true, // true for 465, false for other ports
      auth: {
        user: keyConfig.EMAIL_USER,
        pass: keyConfig.EMAIL_PASSWORD,
      },
    });
  }

  async send(clientAdress: string, email: Email) {
    const mailOptions = {
      from: keyConfig.EMAIL_USER,
      to: clientAdress,
      subject: email.subject,
      text: email.text,
    }
    await this.transporter.sendMail(mailOptions);
  }

  async sendMany(clientAddresses: string[], email: Email) {
    clientAddresses.forEach(async (clientAdress) => {
      await this.send(clientAdress, email);
    });
  }

  
}

export { Email };
export default new EmailService();