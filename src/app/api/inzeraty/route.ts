import { db } from "@/db";
import { items } from "@/db/schemas/inzrat.schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Získání userId z Clerku
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Nejste přihlášeni" }, { status: 401 });
    }

    // 2. Načtení dat z formuláře
    const body = await req.json();
    const { title, description, category, price, isFree, status, contactName, email, image } = body;

    if (!title || !category || !contactName) {
      return Response.json({ error: "Chybí povinná pole" }, { status: 400 });
    }

    // 3. Uložení do databáze
    const newItem = await db.insert(items).values({
      title: title.trim(),
      description: description ?? "",
      category,
      price: isFree ? null : Number(price),
      status: status ?? "Dostupné",
      contactName,
      email: email ?? "",
      image: image ?? null,

      ownerID: userId,
    }).returning();

    return Response.json({ success: true, item: newItem[0] });
  } catch (err: any) {
    console.error("CHYBA SERVERU:", err);
    return Response.json(
      { error: `Chyba serveru: ${err?.message || "Neznámá chyba databáze"}` },
      { status: 500 }
    );
  }
}
