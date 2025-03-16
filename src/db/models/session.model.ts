import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type * as providers from "~/service/api";

export const SessionTable = sqliteTable("session", {
  id: integer("id").primaryKey(),
  selectedProvider: text("selected_provider").$type<keyof typeof providers>(),
});
