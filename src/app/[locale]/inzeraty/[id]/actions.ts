"use server";

import { db } from "@/db";
import { items } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function updateStatus(id: number, status: string) {
  const { userId } = await auth();
  if (!userId) return;

  const item = await db.select().from(items).where(eq(items.id, id)).get();
  if (!item || item.ownerID !== userId) return;

  await db.update(items).set({ status }).where(eq(items.id, id));
  revalidatePath("/", "layout");
}

export async function updateItem(
  id: number,
  data: {
    title: string;
    description: string | null;
    category: string;
    price: number | null;
    status: string;
    contactName: string;
    email: string;
  }
) {
  const { userId } = await auth();
  if (!userId) return;

  const item = await db.select().from(items).where(eq(items.id, id)).get();
  if (!item || item.ownerID !== userId) return;

  await db
    .update(items)
    .set({
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      status: data.status,
      contactName: data.contactName,
      email: data.email,
    })
    .where(eq(items.id, id));

  revalidatePath("/", "layout");
}
