import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ShowTable } from "./show.model";

export const ProgressTable = sqliteTable("progress", {
  id: integer("id").primaryKey(),
  progress: integer("progress"),
  progressPercentage: integer("progress_percentage"),
  showId: integer("show_id"),
  episodeRefId: text("episode_ref_id"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});

export const ProgressRelations = relations(ProgressTable, ({ many, one }) => ({
  show: one(ShowTable, {
    fields: [ProgressTable.showId],
    references: [ShowTable.id],
  }),
}));
