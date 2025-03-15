import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { EpisodeTable } from "./episode.model";

export const ShowTable = sqliteTable("show", {
  id: integer("id").primaryKey(),
  name: integer("name"),
  createdAt: integer("scheduled_at", { mode: "timestamp_ms" }).$defaultFn(
    () => new Date()
  ),
});

export const ShowRelations = relations(ShowTable, ({ many, one }) => ({
  episodes: many(EpisodeTable),
}));
