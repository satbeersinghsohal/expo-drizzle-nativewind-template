import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "~/db/models";
import { useDatabase } from "~/db/provider";

export const useGetSession = () => {
  const { db } = useDatabase();
  return useLiveQuery(db.select().from(schema.SessionTable)).data?.[0] || {id:0, selectedProvider:"HikariTv"};
};
