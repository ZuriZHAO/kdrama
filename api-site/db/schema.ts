import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  payload: text("payload").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  reviewedAt: text("reviewed_at"),
  ipHash: text("ip_hash").notNull(),
  imageKey: text("image_key"),
  imageType: text("image_type"),
  posterKey: text("poster_key"),
  posterType: text("poster_type")
}, table => [
  index("submissions_status_created_idx").on(table.status, table.createdAt),
  index("submissions_ip_created_idx").on(table.ipHash, table.createdAt)
]);
