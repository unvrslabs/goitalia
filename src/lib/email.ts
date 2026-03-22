import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const link = `${BASE_URL}/verifica-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verifica il tuo account GoItalIA",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111827;">Ciao ${name}!</h2>
        <p style="color: #374151;">Clicca il pulsante qui sotto per verificare il tuo account GoItalIA.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Verifica account
        </a>
        <p style="color:#6b7280;margin-top:24px;font-size:14px;">
          Il link scade tra 24 ore. Se non hai creato un account, ignora questa email.
        </p>
        <p style="color:#9ca3af;font-size:12px;">
          Oppure copia questo link nel browser:<br>${link}
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const link = `${BASE_URL}/nuova-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reimposta la tua password GoItalIA",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111827;">Ciao ${name}!</h2>
        <p style="color: #374151;">Hai richiesto di reimpostare la tua password. Clicca il pulsante qui sotto.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Reimposta password
        </a>
        <p style="color:#6b7280;margin-top:24px;font-size:14px;">
          Il link scade tra 1 ora. Se non hai richiesto il reset, ignora questa email.
        </p>
      </div>
    `,
  });
}
