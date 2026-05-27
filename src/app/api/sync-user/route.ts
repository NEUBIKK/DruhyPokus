import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  if (!clerkUser) return Response.json({ error: "No user" }, { status: 404 });

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!existing) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      clerkId: userId,
      name: clerkUser.fullName ?? clerkUser.username ?? "Uživatel",
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      image: clerkUser.imageUrl,
      createdAt: new Date(),
    });
  }

  return Response.json({ ok: true });
}
