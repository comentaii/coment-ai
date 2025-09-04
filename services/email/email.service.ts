import nodemailer from 'nodemailer';
import { ROLE_LABELS } from '@/lib/constants/roles';

interface UserInvitationData {
  to: string;
  name: string;
  tempPassword: string;
  roles: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendUserInvitation(data: UserInvitationData): Promise<void> {
    const roleLabels = data.roles.map(role => ROLE_LABELS[role as keyof typeof ROLE_LABELS]).join(', ');
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: data.to,
      subject: 'Coment-AI Platform Davetiyesi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #21C55D;">Coment-AI Platform'a Hoş Geldiniz!</h2>
          
          <p>Merhaba ${data.name},</p>
          
          <p>Sizi Coment-AI platformuna davet etmekten mutluluk duyuyoruz. Hesabınız oluşturuldu ve aşağıdaki bilgilerle giriş yapabilirsiniz:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${data.to}</p>
            <p><strong>Geçici Şifre:</strong> ${data.tempPassword}</p>
            <p><strong>Roller:</strong> ${roleLabels}</p>
          </div>
          
          <p><strong>Önemli:</strong> İlk girişinizde şifrenizi değiştirmeniz önerilir.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/auth/signin" 
               style="background-color: #21C55D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Platforma Giriş Yap
            </a>
          </div>
          
          <p>Herhangi bir sorunuz olursa, lütfen bizimle iletişime geçin.</p>
          
          <p>İyi çalışmalar,<br>Coment-AI Ekibi</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(data: { to: string; name: string; resetToken: string }): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: data.to,
      subject: 'Coment-AI Şifre Sıfırlama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #21C55D;">Şifre Sıfırlama</h2>
          
          <p>Merhaba ${data.name},</p>
          
          <p>Şifre sıfırlama talebiniz alındı. Aşağıdaki linke tıklayarak yeni şifrenizi oluşturabilirsiniz:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${data.resetToken}" 
               style="background-color: #21C55D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          
          <p><strong>Not:</strong> Bu link 1 saat geçerlidir.</p>
          
          <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          
          <p>İyi çalışmalar,<br>Coment-AI Ekibi</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();

