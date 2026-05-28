import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  category: text().notNull(),
  price: int(),
  status: text(),
  contactName: text().notNull(),
  image: text(),
  email: text().notNull(),
  ownerID: text(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
