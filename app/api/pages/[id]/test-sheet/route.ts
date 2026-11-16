import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const page = await prisma.page.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Halaman tidak ditemukan." }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const webhookUrl = body.webhookUrl || page.googleSheetsWebhookUrl;

    if (!webhookUrl || !webhookUrl.trim().startsWith("https://script.google.com/macros/s/")) {
      return NextResponse.json(
        {
          error:
            "Format URL tidak valid. Pastikan URL diawali dengan 'https://script.google.com/macros/s/...' dari Deployment Google Apps Script Anda.",
        },
        { status: 400 }
      );
    }

    // Send sample test row to user's Google Apps Script
    const testPayload = {
      event: page.title,
      timestamp: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      "Nama Lengkap": "Uji Coba QuickLaunch",
      "Nomor WhatsApp": "081234567890",
      "Status": "Koneksi Berhasil",
    };

    // Google Apps Script Web App redirects (HTTP 302), so follow redirects
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
      redirect: "follow",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok && res.status !== 302) {
      return NextResponse.json(
        {
          error: `Google Apps Script merespons dengan status error: ${res.status}. Pastikan deployment diset 'Akses: Siapa saja (Anyone)'.`,
        },
        { status: 400 }
      );
    }

    // Save verified webhook URL to page
    await prisma.page.update({
      where: { id: page.id },
      data: { googleSheetsWebhookUrl: webhookUrl.trim() },
    });

    return NextResponse.json({
      success: true,
      message:
        "Koneksi berhasil! Baris data pengujian telah sukses dikirim ke Google Sheets Anda.",
    });
  } catch (error: any) {
    console.error("Test sheet error:", error);
    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Koneksi timeout. Pastikan Google Apps Script Anda sudah di-deploy dengan benar.",
        },
        { status: 408 }
      );
    }
    return NextResponse.json(
      {
        error:
          "Gagal menghubungi Google Apps Script. Pastikan URL sudah benar dan dapat diakses publik.",
      },
      { status: 500 }
    );
  }
}

