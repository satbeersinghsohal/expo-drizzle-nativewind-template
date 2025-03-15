import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ShowTable } from "./show.model";
import { ProgressTable } from "./progress.model";

export const EpisodeTable = sqliteTable("episode", {
  id: integer("id").primaryKey(),
  name: integer("name"),
  showId: integer("episode_id"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});

export const EpisodeRelations = relations(EpisodeTable, ({ many, one }) => ({
  show: one(ShowTable, {
    fields: [EpisodeTable.showId],
    references: [ShowTable.id],
  }),
  progress: one(ProgressTable),
}));
