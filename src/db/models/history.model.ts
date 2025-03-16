import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { ShowTable } from "./show.model";

export const HistoryTable = sqliteTable("history", {
  id: integer("id").primaryKey(),
  showId: integer("episode_id"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});
export const HistoryRelations = relations(HistoryTable, ({ many, one }) => ({
  show: one(ShowTable, {
    fields: [HistoryTable.showId],
    references: [ShowTable.id],
  }),
}));
