import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ProgressTable } from "./progress.model";

export const ShowTable = sqliteTable("show", {
  id: integer("id").primaryKey(),
  title: text("title"),
  image: text("image"),
  refShowId: text("ref_show_id"),
  provider: text("provider"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});
export const ShowRelations = relations(ShowTable, ({ many }) => ({
  show: many(ProgressTable),
}));
