import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { items } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { KontaktEmail } from "@/emails/kontakt-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
  }

  const { zprava, odesilatelEmail, itemId } = await req.json();

  if (!zprava || !odesilatelEmail || !itemId) {
    return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
  }

  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, Number(itemId)))
    .get();

  if (!item) {
    return NextResponse.json({ error: "Inzerát nenalezen" }, { status: 404 });
  }

  // owner nemůže kontaktovat sám sebe
  if (item.ownerID === userId) {
    return NextResponse.json({ error: "Nelze kontaktovat vlastní inzerát" }, { status: 403 });
  }

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev", // po ověření domény změň na svůj email
    to: item.email,
    subject: `Zpráva k inzerátu: ${item.title}`,
    react: KontaktEmail({ zprava, odesilatelEmail, inzeratTitle: item.title }),
  });

  if (error) {
    return NextResponse.json({ error: "Nepodařilo se odeslat email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


