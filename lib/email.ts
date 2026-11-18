import nodemailer from "nodemailer";

interface SendOtpOptions {
  to: string;
  name: string;
  otpCode: string;
  expiresInMinutes?: number;
}

export async function sendOtpEmail({
  to,
  name,
  otpCode,
  expiresInMinutes = 15,
}: SendOtpOptions): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const from = process.env.SMTP_FROM || `"QuickLaunch Security" <noreply@quicklaunch.id>`;

  // Jika kredensial SMTP belum dipasang di environment
  if (!host || !user || !pass) {
    console.log(`[Email Service (Simulasi)]: Kode OTP untuk ${to} (${name}) adalah ${otpCode}`);
    return {
      success: true,
      simulated: true,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
          .content { padding: 32px 28px; color: #1e293b; line-height: 1.6; }
          .otp-box { background: #f1f5f9; border: 2px dashed #93c5fd; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; }
          .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">QuickLaunch Security</h1>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Verifikasi Permintaan Reset Kata Sandi</p>
          </div>
          <div class="content">
            <p style="margin-top: 0;">Halo <strong>${name}</strong>,</p>
            <p>Kami menerima permintaan untuk mereset kata sandi akun QuickLaunch Anda. Gunakan kode verifikasi rahasia 6-digit berikut untuk memvalidasi identitas Anda:</p>
            
            <div class="otp-box">
              <span class="otp-code">${otpCode}</span>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
              ⚠️ <strong>PENTING:</strong> Kode ini hanya berlaku selama <strong>${expiresInMinutes} menit</strong> dan bersifat rahasia. Jangan pernah memberikan kode ini kepada siapa pun. Jika Anda tidak merasa mengajukan permohonan ini, segera abaikan email ini dan akun Anda tetap aman.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} QuickLaunch Studio. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from,
      to,
      subject: `[QuickLaunch] Kode Verifikasi Reset Kata Sandi Anda: ${otpCode}`,
      html: htmlContent,
    });

    return { success: true, simulated: false };
  } catch (error: any) {
    console.error("Gagal mengirim email OTP:", error);
    return { success: false, error: error.message };
  }
}
