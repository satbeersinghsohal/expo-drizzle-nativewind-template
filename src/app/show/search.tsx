import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useGetShowsByFilter } from "~/service/hooks/useGetShow";

export default function Screen() {
  const [filters, setFilters] = useState<
    NonNullable<Parameters<typeof useGetShowsByFilter>[number]>
  >({
    searchQuery: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetFilters = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setFilters((prev) => ({ ...prev, searchQuery: query }));
        }, 300);
      };
    })(),
    []
  );

  const query = useGetShowsByFilter(filters);
  console.log(query.data, query.isPending, filters);

  return (
    <ScrollView className="px-4">
      <Input
        placeholder="Search by show name"
        onChangeText={(e) => {
          setSearchTerm(e);
          debouncedSetFilters(e);
        }}
        value={searchTerm}
      />
      {query.data && (
        <FlatList
          className="mt-4 w-full mx-auto"
          data={query.data}
          numColumns={2}
          
          renderItem={({ item, index }) => (
            <Pressable onPress={() => router.push(`/show/${item.showId}`)}>
              <View
                key={(index + 1).toString()}
                className="relative aspect-showCard h-72 mx-3 mb-3"
              >
                <Image
                  src={item.image}
                  className="w-full h-64 p-0 rounded-t-lg"
                  resizeMode="cover"
                />
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
    </ScrollView>
  );
}
