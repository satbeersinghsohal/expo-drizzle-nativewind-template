import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { EpisodeTable } from "./episode.model";

export const ProgressTable = sqliteTable("progress", {
  id: integer("id").primaryKey(),
  progress: integer("progress"),
  episodeId: integer("episode_id"),
  showId: integer("episode_id"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});
export const ProgressRelations = relations(ProgressTable, ({ many, one }) => ({
  episode: one(EpisodeTable, {
    fields: [ProgressTable.episodeId],
    references: [EpisodeTable.id],
  }),
}));
