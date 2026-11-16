import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  generateRegistrationCode,
  buildWhatsAppConfirmationLink,
} from "@/lib/whatsapp";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Halaman pendaftaran tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const rawData = body.data || body;

    // Validate required fields and map clean labels
    const missingFields: string[] = [];
    const formattedData: Record<string, any> = {};

    for (const field of page.fields) {
      const val = rawData[field.id] || rawData[field.label] || "";
      if (field.required && (!val || String(val).trim() === "")) {
        missingFields.push(field.label);
      }
      formattedData[field.label] = val;
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Mohon lengkapi kolom wajib: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Generate unique registration code
    const registrationCode = generateRegistrationCode();
    formattedData["Kode Pendaftaran"] = registrationCode;

    // Save to internal database
    const submission = await prisma.submission.create({
      data: {
        pageId: page.id,
        data: JSON.stringify(formattedData),
        statusSyncSheet: "pending",
      },
    });

    // Auto-sync to Google Sheets Webhook (Tahap 4) if configured
    let syncStatus = "pending";
    if (page.googleSheetsWebhookUrl && page.googleSheetsWebhookUrl.trim() !== "") {
      try {
        const payload = {
          event: page.title,
          timestamp: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
          ...formattedData,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const sheetRes = await fetch(page.googleSheetsWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          redirect: "follow",
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (sheetRes.ok || sheetRes.status === 302) {
          syncStatus = "synced";
        } else {
          syncStatus = "failed";
        }
      } catch (syncErr) {
        console.error("Auto-sync to Google Sheets error:", syncErr);
        syncStatus = "failed";
      }

      // Update sync status in DB
      await prisma.submission.update({
        where: { id: submission.id },
        data: { statusSyncSheet: syncStatus },
      });
    }

    // Generate WhatsApp Confirmation Link (Tahap 5)
    const attendeeName =
      formattedData["Nama Lengkap"] ||
      formattedData["Nama Pembeli"] ||
      formattedData["Nama"] ||
      "Peserta";

    const ticketChoice =
      formattedData["Kategori Tiket"] ||
      formattedData["Pilihan Tiket / Kategori"] ||
      formattedData["Varian / Jumlah Pesanan"] ||
      formattedData["Tiket"] ||
      "Reguler";

    const attendeeContact =
      formattedData["Nomor WhatsApp"] ||
      formattedData["WhatsApp"] ||
      formattedData["No HP"] ||
      "";

    const waConfirmationLink = buildWhatsAppConfirmationLink(
      page.waNumber,
      page.waMessageTemplate,
      {
        event: page.title,
        nama: attendeeName,
        kode: registrationCode,
        tiket: ticketChoice,
        kontak: attendeeContact,
      }
    );

    return NextResponse.json({
      message: "Pendaftaran berhasil dikirim!",
      submissionId: submission.id,
      registrationCode,
      waConfirmationLink,
      submittedAt: submission.createdAt,
      syncStatus,
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan pendaftaran." },
      { status: 500 }
    );
  }
}
