import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    if (params.id === adminUser.id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun admin yang sedang Anda gunakan." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Hapus pengguna secara permanen (semua page & payment order akan cascade delete sesuai relasi schema)
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Akun "${targetUser.name}" (${targetUser.email}) beserta seluruh halamannya berhasil dihapus permanen.`,
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengguna dari database." },
      { status: 500 }
    );
  }
}
