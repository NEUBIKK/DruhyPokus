import { db } from "@/db";
import { items } from "@/db/schemas/inzrat.schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, price, isFree, status, contactName, email, image } = body;

    if (!title || !category || !contactName || !status) {
      return Response.json({ error: "Chybí povinná pole" }, { status: 400 });
    }

    const newItem = await db.insert(items).values({
      title,
      description: description ?? "",
      category,
      price: isFree ? null : Number(price),
      status,
      contactName,
      email: email ?? null,
      image: image ?? null,
    }).returning();

    return Response.json({ success: true, item: newItem[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
