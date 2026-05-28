import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { items } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { KontaktForm } from "./KontaktForm.client";

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations();

  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, Number(id)))
    .get();

  if (!item) notFound();

  const { userId } = await auth();

  // owner nemůže kontaktovat sám sebe → redirect zpět
  if (userId && item.ownerID === userId) {
    redirect(`/${locale}/inzeraty/${id}`);
  }

  // prodaný inzerát → redirect zpět
  if (item.status === "Prodáno / Předáno") {
    redirect(`/${locale}/inzeraty/${id}`);
  }

  const user = await currentUser();
  const predvyplnenyEmail =
    user?.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <KontaktForm
      itemId={id}
      inzeratTitle={item.title}
      predvyplnenyEmail={predvyplnenyEmail}
      locale={locale}
    />
  );
}
