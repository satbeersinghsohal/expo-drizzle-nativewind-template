import { useMutation, useQuery } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "~/db/models";
import { useDatabase } from "~/db/provider";
import * as providers from "~/service/api";
import { useGetSession } from "./useGetSession";

export const useGetSingleShowDetails = (showId?: string) => {
  const session = useGetSession();
  return useQuery({
    queryKey: ["SHOW", showId, session.selectedProvider],
    queryFn: () =>
      showId && session.selectedProvider
        ? providers[session.selectedProvider].getSingleShowDetails(showId)
        : null,
    staleTime: 1000 * 6000,
  });
};

export const useGetEpisodes = (showId?: string, slug?: string) => {
  const session = useGetSession();
  const { db } = useDatabase();

  return useQuery({
    queryKey: ["EPISODE", slug, showId, session.selectedProvider],
    queryFn: async () => {
      if (!showId || !slug || !session.selectedProvider) return null;
      const data = await providers[session.selectedProvider].getEpisodes(
        showId,
        slug
      );
      const progressData = await db
        .select({ progress: schema.ProgressTable })
        .from(schema.ProgressTable)
        .leftJoin(
          schema.ShowTable,
          eq(schema.ShowTable.id, schema.ProgressTable.showId)
        )
        .where(
          and(
            eq(schema.ShowTable.provider, session.selectedProvider || ""),
            eq(schema.ShowTable.refShowId, showId)
          )
        );
      const progressMap = new Map(
        progressData.map((i) => [i.progress.episodeRefId, i.progress])
      );
      return data.map((i) => ({
        ...i,
        progress: progressMap.get(i.episodeNumber.toString()),
      }));
    },
    staleTime: 1000 * 60,
  });
};

export const useGetEpisodeProgress = (showId: string, episodeId: string) => {
  const { db } = useDatabase();
  const session = useGetSession();
  const progress = useLiveQuery(
    db
      .select()
      .from(schema.ProgressTable)
      .leftJoin(
        schema.ShowTable,
        eq(schema.ShowTable.id, schema.ProgressTable.showId)
      )
      .where(
        and(
          eq(schema.ShowTable.provider, session.selectedProvider || ""),
          eq(schema.ShowTable.refShowId, showId),
          eq(schema.ProgressTable.episodeRefId, episodeId)
        )
      )
  );

  return progress?.data?.[0] || null;
};

export const useShowMutation = () => {
  const { db } = useDatabase();
  const session = useGetSession();

  return useMutation({
    mutationFn: async (
      show: NonNullable<ReturnType<typeof useGetSingleShowDetails>["data"]>
    ) => {
      const data = await db
        .select()
        .from(schema.ShowTable)
        .where(
          and(
            eq(schema.ShowTable.refShowId, show.showId),
            eq(schema.ShowTable.provider, session.selectedProvider || "")
          )
        );
      const exist = data[0];

      if (!exist) {
        await db.insert(schema.ShowTable).values({
          title: show.title,
          image: show.image,
          provider: session.selectedProvider || "",
          refShowId: show.showId,
        });
      }
    },
  });
};

export const useEpisodeProgressMutation = () => {
  const { db } = useDatabase();
  const session = useGetSession();

  return useMutation({
    mutationFn: async (payload: {
      refShowId: string;
      episodeRefId: string;
      progress: number;
      progressPercentage: number;
    }) => {
     

      const [exist] = await db
        .select()
        .from(schema.ShowTable)
        .where(
          and(
            eq(schema.ShowTable.refShowId, payload.refShowId),
            eq(schema.ShowTable.provider, session.selectedProvider || "")
          )
        );
     

      if (!exist) {
        throw new Error("show not found");
      }
     

      const [progressExist] = await db
        .select()
        .from(schema.ProgressTable)
        .where(
          and(
            eq(schema.ProgressTable.episodeRefId, payload.episodeRefId || ""),
            eq(schema.ProgressTable.showId, exist?.id || 0)
          )
        );

     
      let progressId = progressExist?.id
      if (progressExist) {
       

        await db.update(schema.ProgressTable).set({
          progress: payload.progress,
          progressPercentage: payload.progressPercentage,
          updatedAt: new Date()
        });
       
      } else {
       

        const [tmp] = await db.insert(schema.ProgressTable).values({
          progress: payload.progress,
          progressPercentage: payload.progressPercentage,
          episodeRefId: payload.episodeRefId || "",
          showId: exist?.id,
          updatedAt: new Date()
        }).returning({id: schema.ProgressTable.id})
        progressId = tmp.id
      }
      await db.update(schema.ShowTable).set({
        progressId:progressId,
        lastWatchedAt:new Date()
      }).where(eq(schema.ShowTable.id, exist.id))
    },
  });
};
