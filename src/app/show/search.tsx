import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import moment from "moment";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { ScrollView as ScrollView2 } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { useGetShowsByFilter } from "~/service/hooks/useGetShow";
const currentYear = moment().format("YYYY");
const seasons = [
  {
    name: "Fall",
    code: "4",
    startMonth: 10,
  },
  {
    name: "Summer",
    code: "3",
    startMonth: 7,
  },
  {
    name: "Spring",
    code: "2",
    startMonth: 4,
  },
  {
    name: "Winter",
    code: "1",
    startMonth: 1,
  },
];

const generateSeasonData = (noOfyears: number) => {
  return Array(noOfyears)
    .fill(1)
    .map((i, index) => moment().subtract(index, "year").format("YYYY"))
    .flatMap((year) => {
      let tmp = seasons;
      if (year === currentYear) {
        tmp = seasons.filter(
          (j) => j.startMonth <= Number.parseInt(moment().format("MM"))
        );
      }
      return tmp.map((i) => ({
        label: `${i.name}( ${year} )`,
        value: `${i.code}_${year}`,
        year: year,
        season: i.code,
      }));
    });
};

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: {
  layoutMeasurement: { height: number };
  contentOffset: { y: number };
  contentSize: { height: number };
}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default function Screen() {
  // ref
  const [modalState, setModalState] = useState(false);
  const [seasons, setSeasons] = useState(() => generateSeasonData(3));

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState<
    NonNullable<Parameters<typeof useGetShowsByFilter>[number]>
  >({
    searchQuery: "",
    season: "",
    year: "",
  });

  console.log("filters", filters);

  const [tmpFilter, setTmpFilter] = useState<
    NonNullable<Parameters<typeof useGetShowsByFilter>[number]>
  >({
    searchQuery: "",
    season: "",
    year: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      android: insets.bottom + 24,
      default: insets.bottom,
    }),
    left: 12,
    right: 12,
  };

  const handlePresentModalPress = useCallback(() => {
    setModalState((prev) => {
      if (prev) {
        bottomSheetModalRef.current?.dismiss();
        return false;
      }

      bottomSheetModalRef.current?.present();
      return true;
    });
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setModalState(false);
    }
  }, []);

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
    <BottomSheetModalProvider>
      <ScrollView className="px-4">
        <View className="flex flex-row gap-2">
          <Input
            className="grow"
            placeholder="Search by show name"
            onChangeText={(e) => {
              setSearchTerm(e);
              debouncedSetFilters(e);
            }}
            value={searchTerm}
          />
          <Button
            className="aspect-square flex flex-row gap-2 items-center justify-center"
            onPress={handlePresentModalPress}
          >
            <SlidersHorizontal color={"#000"} size={15} />
          </Button>
        </View>
        {query.isPending && (
          <View className="flex-1 items-center justify-center h-[90vh]">
            <ActivityIndicator color={"#fff"} size="large" />
          </View>
        )}
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: "#27272a" }}
        snapPoints={["80%"]}
      >
        <BottomSheetView
          style={{
            flex: 1,
            backgroundColor: "#27272a",
            paddingInline: 10,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Select
              value={
                tmpFilter.season && tmpFilter.year
                  ? seasons.find(
                      (i) =>
                        i.year === tmpFilter.year &&
                        i.season === tmpFilter.season
                    )
                  : undefined
              }
              onValueChange={(val) => {
                const tmp = seasons.find((i) => i.value === val?.value);
                setTmpFilter((prev) => ({
                  ...prev,
                  year: tmp?.year || "",
                  season: tmp?.season || "",
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder="Select a Season"
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="w-full">
                <ScrollView2
                  className="max-h-96"
                  onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                      setSeasons((prev) => generateSeasonData(prev.length + 3));
                    }
                  }}
                >
                  <SelectGroup>
                    {seasons.map((i) => (
                      <SelectItem label={i.label} value={i.value} key={i.label}>
                        {i.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </ScrollView2>
              </SelectContent>
            </Select>
          </View>
          <View className="gap-2 mb-6">
            <Button
              onPress={() => {
                setFilters(tmpFilter);
                handlePresentModalPress();
              }}
            >
              <Text>Apply</Text>
            </Button>
            <Button
              variant={"outline"}
              onPress={() => {
                setTmpFilter({
                  searchQuery: "",
                  season: "",
                  year: "",
                });
                setFilters({
                  searchQuery: "",
                  season: "",
                  year: "",
                });
              }}
            >
              <Text>Clear</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
