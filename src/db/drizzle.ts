import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "~/db/models";
import migrations from "./migrations/migrations";

const expoDb = openDatabaseSync("database.db", { enableChangeListener: true });
const db = drizzle(expoDb, { schema });

export const initialize = (): Promise<typeof db> => {
  return Promise.resolve(db);
};
export const useMigrationHelper = () => {
  return useMigrations(db, migrations);
};
