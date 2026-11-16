import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Lock, ArrowLeft, Rocket } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan | QuickLaunch",
    };
  }

  return {
    title: `${page.title} | Pendaftaran Resmi`,
    description: page.description || `Halaman pendaftaran ${page.title}`,
    openGraph: {
      title: page.title,
      description: page.description || `Pendaftaran online untuk ${page.title}`,
      images: page.bannerUrl ? [{ url: page.bannerUrl }] : [],
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: {
      fields: { orderBy: { order: "asc" } },
    },
  });

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Alamat tautan yang Anda buka tidak terdaftar atau sudah dihapus oleh pemilik acara.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Rocket className="h-4 w-4" />
          Buka QuickLaunch Studio
        </Link>
      </div>
    );
  }

  // Check Draft status vs Owner preview
  const currentUser = await getCurrentUser();
  const isOwner = currentUser && currentUser.id === page.userId;

  if (page.status !== "published" && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Halaman Belum Dipublikasikan</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md leading-relaxed">
          Panitia/penjual masih mempersiapkan halaman <strong>{page.title}</strong> dalam status draf. Silakan hubungi panitia terkait atau periksa kembali nanti.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Increment views count asynchronously if published
  if (page.status === "published") {
    prisma.page
      .update({
        where: { id: page.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch((err) => console.error("Increment view count error:", err));
  }

  return (
    <div>
      {/* Banner if viewed by owner in draft mode */}
      {page.status !== "published" && isOwner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow-sm">
          <span>⚠️ <strong>Mode Pratinjau Pemilik:</strong> Halaman ini berstatus Draf dan belum dapat diakses oleh publik.</span>
          <Link
            href={`/builder/${page.id}`}
            className="underline font-bold text-slate-950 hover:opacity-80 ml-2"
          >
            Buka Editor untuk Publikasikan
          </Link>
        </div>
      )}

      <TemplateRenderer
        templateId={page.templateId}
        data={page}
        fields={page.fields}
        isDraft={false}
      />
    </div>
  );
}
