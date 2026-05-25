"use server";

import { db } from "@/db";
import { items } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStatus(id: number, status: string) {
  await db.update(items).set({ status }).where(eq(items.id, id));
  revalidatePath("/", "layout");
}
