import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  clerkId: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull().unique(),
  image: text(),
  createdAt: int({ mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
