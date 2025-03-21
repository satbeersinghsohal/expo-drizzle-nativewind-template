import { router, useLocalSearchParams } from "expo-router";
import { Pause, Play, Star } from "lucide-react-native";
import * as React from "react";
import { FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { SelectSeparator } from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import {
  useGetEpisodes,
  useGetSingleShowDetails,
  useShowMutation,
} from "~/service/hooks/useGetSingleShow";

export default function Screen() {
  const { id } = useLocalSearchParams();
  
  const query = useGetSingleShowDetails(id as string);
  const episodeQuery = useGetEpisodes(id as string, query.data?.slug);
  const showMutation = useShowMutation();
  const latestEp = episodeQuery.data?.sort(
    (a, b) =>
      +(b.progress?.episodeRefId || 0) - +(a.progress?.episodeRefId || 0)
  )?.[0];
  React.useEffect(() => {
    if (!query.data) return;
    showMutation.mutate({
      ...query.data,
      showId: id as string,
    });
  }, [query.data]);

  return (
    <ScrollView>
      {query.isPending && <Skeleton className={"w-screen h-80"} />}
      {query.data && (
        <Image
          src={query.data?.image}
          className="h-96 aspect-showCard rounded-lg mx-auto"
        />
      )}
      <Text className="text-xl font-semibold px-4 mt-2">
        {query.data?.title}
      </Text>
      {query.data && (
        <View className="flex flex-row px-4 mt-1 gap-2 flex-wrap">
          <View className="px-4 py-1 bg-secondary rounded-full flex flex-row gap-1 items-center justify-center">
            <Star fill={"#EFBF04"} size={15} />
            <Text className="text-xs">{query.data?.score}</Text>
          </View>
          <View className="px-4 py-1 bg-secondary rounded-full flex flex-row gap-1 items-center justify-center">
            <Text className="text-xs">{query.data?.status}</Text>
          </View>
          <View className="px-4 py-1 bg-secondary rounded-full flex flex-row gap-1 items-center justify-center">
            <Text className="text-xs">{query.data?.duration}</Text>
          </View>
          <View className="px-4 py-1 bg-secondary rounded-full flex flex-row gap-1 items-center justify-center">
            <Text className="text-xs">
              {query.data?.seasons?.length} Season
            </Text>
          </View>
        </View>
      )}
      {query.data && (
        <View className="px-4 mt-4">
          {!latestEp ? (
            <Button
              className="flex flex-row"
              onPress={() =>
                router.push({
                  pathname: "/episode",
                  params: {
                    id,
                    slug: query.data?.slug,
                    eps: 1,
                  },
                })
              }
            >
              <Play fill={"#000"} />
              <Text>Play</Text>
            </Button>
          ) : (
            <Button
              className="flex flex-row"
              onPress={() =>
                router.push({
                  pathname: "/episode",
                  params: {
                    id,
                    slug: query.data?.slug,
                    eps: latestEp.episodeNumber,
                  },
                })
              }
            >
              <Pause fill={"#000"} />
              <Text>Resume Ep{latestEp.episodeNumber}</Text>
            </Button>
          )}
        </View>
      )}
      <Text className="px-4 mt-2 line-clamp-3">{query.data?.description}</Text>
      <Text className="px-4 mt-2 text-muted-foreground">
        Generes: {query.data?.generes}
      </Text>
      <Text className="px-4 mt-4 text-xl font-semibold mb-4">Episodes</Text>
      {episodeQuery.isPending && (
        <View className="flex gap-2">
          <Skeleton className={"w-screen h-10"} />
          <Skeleton className={"w-screen h-10"} />
          <Skeleton className={"w-screen h-10"} />
        </View>
      )}
      <View>
        {episodeQuery.data && (
          <FlatList
            data={episodeQuery.data}
            ListFooterComponent={() => <View className="h-10 w-screen" />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/episode",
                    params: {
                      id,
                      slug: query.data?.slug,
                      eps: item.episodeNumber,
                    },
                  })
                }
              >
                <View className="flex flex-row px-4 py-2 items-center gap-2">
                  <Text
                    className={cn(
                      item.progress?.progressPercentage &&
                        item.progress.progressPercentage >= 80
                        ? "text-muted-foreground"
                        : ""
                    )}
                  >
                    {item.title
                      .replace(/[^a-zA-Z0-9-,!& ]/g, "")
                      .replace(/\s+/g, " ")
                      .trim()}
                  </Text>
                </View>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <SelectSeparator />}
          />
        )}
      </View>
    </ScrollView>
  );
}
