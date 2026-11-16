import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import BuilderEditor from "./BuilderEditor";

export default async function BuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const page = await prisma.page.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      fields: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page) {
    notFound();
  }

  return <BuilderEditor initialPage={page} user={user} />;
}

