import { useRouter } from "expo-router";
import * as React from "react";
import { FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Carousel } from "~/components/ui/carousel";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useGetHomePage } from "~/service/hooks/useGetHomeScreen";

export default function Screen() {
  const query = useGetHomePage();
  const router = useRouter();

  return (
    <ScrollView>
      <View className="h-72">
        {query.isPending && <Skeleton className={"w-screen h-full"} />}
        {!query.isPending && query.data && (
          <Carousel
            data={query.data?.banners}
            enableAutoScroll={true}
            renderItem={(item, index) => (
              <Pressable onPress={() => router.push(`/show/${item.showId}`)}>
                <View key={(index + 1).toString()} className="relative">
                  <Image
                    src={item.image}
                    className="w-screen h-64 p-0"
                    resizeMode="cover"
                  />
                  <View className="px-4 py-1 mt-1 bg-secondary rounded-full">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
      <Text className="text-3xl font-semibold px-2 my-3">Recently Added</Text>
      <View className="px-2">
        {query.isPending && <Skeleton className={"w-screen h-72"} />}
        {!query.isPending && query.data && (
          <FlatList
            data={query.data?.recentlyAddedShows}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => router.push(`/show/${item.showId}`)}>
                <View
                  key={(index + 1).toString()}
                  className="relative aspect-showCard h-72 mx-2"
                >
                  <Image
                    src={item.image}
                    className="w-full h-64 p-0"
                    resizeMode="cover"
                  />
                  <View className="absolute top-1 right-1 px-2 py-1 bg-secondary rounded-full">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.latestEpisodeNumber}
                    </Text>
                  </View>
                  <View className="px-4 py-1 bg-secondary rounded-b-lg">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
      <Text className="text-3xl font-semibold px-2 my-3">Currently Airing</Text>
      <View className="px-2">
        {query.isPending && <Skeleton className={"w-screen h-72"} />}
        {!query.isPending && query.data && (
          <FlatList
            data={query.data?.currentlyAiringShows}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => router.push(`/show/${item.showId}`)}>
                <View
                  key={(index + 1).toString()}
                  className="relative aspect-showCard h-72 mx-2"
                >
                  <Image
                    src={item.image}
                    className="w-full h-64 p-0"
                    resizeMode="cover"
                  />
                  <View className="absolute top-1 right-1 px-2 py-1 bg-secondary rounded-full">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.latestEpisodeNumber}
                    </Text>
                  </View>
                  <View className="px-4 py-1 bg-secondary rounded-b-lg">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
      <Text className="text-3xl font-semibold px-2 my-3">Top Shows</Text>
      <View className="px-2">
        {query.isPending && <Skeleton className={"w-screen h-72"} />}
        {!query.isPending && query.data && (
          <FlatList
            data={query.data?.topShows}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => router.push(`/show/${item.showId}`)}>
                <View
                  key={(index + 1).toString()}
                  className="relative aspect-showCard h-72 mx-2"
                >
                  <Image
                    src={item.image}
                    className="w-full h-64 p-0"
                    resizeMode="cover"
                  />
                  <View className="absolute top-1 right-1 px-2 py-1 bg-secondary rounded-full">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.rank}
                    </Text>
                  </View>
                  <View className="px-4 py-1 bg-secondary rounded-b-lg">
                    <Text className="text-xs font-semibold line-clamp-1">
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}
