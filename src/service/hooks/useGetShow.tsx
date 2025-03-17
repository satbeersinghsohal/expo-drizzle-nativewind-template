import { useQuery } from "@tanstack/react-query";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "~/db/models";
import { useDatabase } from "~/db/provider";
import * as providers from "~/service/api";
import { useGetSession } from "./useGetSession";
type FilterKeys = "searchQuery" | "year" | "season";

export const useGetShowsByFilter = (filter: Record<FilterKeys, string>) => {
  const session = useGetSession();

  return useQuery({
    queryKey: ["SHOW_SEARCH", filter.searchQuery, filter.season, filter.year],
    queryFn: () =>
      Object.keys(filter).some((k) => filter[k as FilterKeys]) &&
      session.selectedProvider
        ? providers[session.selectedProvider].getShowsByFilter(filter)
        : null,
    staleTime: 1000 * 60,
  });
};

export const useGetCurrentlyWachingShows = () => {
  const session = useGetSession();
  const { db } = useDatabase();

  return useLiveQuery(
    db
      .select()
      .from(schema.ShowTable)
      .leftJoin(
        schema.ProgressTable,
        eq(schema.ShowTable.progressId, schema.ProgressTable.id)
      )
      .where(
        and(
          eq(schema.ShowTable.provider, session.selectedProvider || ""),
          isNotNull(schema.ShowTable.lastWatchedAt)
        )
      )
      .limit(20)
      .orderBy(desc(schema.ShowTable.lastWatchedAt))
  ).data.map((i) => ({ ...i.show, progress: i.progress }));
};
