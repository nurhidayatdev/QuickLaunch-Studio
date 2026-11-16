export const DEFAULT_WA_TEMPLATE =
  "Halo panitia {event}, saya {nama} telah mendaftar dengan kode #{kode} (Pilihan: {tiket}). Mohon info langkah selanjutnya. Terima kasih!";

export function generateRegistrationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QL-${randomCode}`;
}

export function normalizePhoneNumber(raw?: string | null): string {
  if (!raw) return "";
  let digits = raw.replace(/[^0-9]/g, "");

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith("8")) {
    digits = `62${digits}`;
  }

  return digits;
}

export interface WhatsAppVariables {
  event?: string;
  nama?: string;
  kode?: string;
  tiket?: string;
  kontak?: string;
  [key: string]: string | undefined;
}

export function fillWhatsAppTemplate(
  template: string | null | undefined,
  variables: WhatsAppVariables
): string {
  let message = template && template.trim() ? template : DEFAULT_WA_TEMPLATE;

  message = message.replace(/\{event\}/gi, variables.event || "Acara");
  message = message.replace(/\{nama\}/gi, variables.nama || "Peserta");
  message = message.replace(/\{kode\}/gi, variables.kode || "QL-DEMO");
  message = message.replace(/\{tiket\}/gi, variables.tiket || "Reguler");
  message = message.replace(/\{kontak\}/gi, variables.kontak || "");

  return message;
}

export function buildWhatsAppConfirmationLink(
  phone: string | null | undefined,
  template: string | null | undefined,
  variables: WhatsAppVariables
): string {
  const cleanPhone = normalizePhoneNumber(phone);
  if (!cleanPhone) return "#";

  const message = fillWhatsAppTemplate(template, variables);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

