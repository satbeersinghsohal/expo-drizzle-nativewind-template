import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { Text } from "~/components/ui/text";
import { useGetEpisodes } from "~/service/hooks/useGetSingleShow";

export default function Screen() {
  const item = useLocalSearchParams();

  const episodeQuery = useGetEpisodes(item.id as string, item.slug as string);

  const iframeUrl = episodeQuery.data?.find((i) => i.iframe)?.iframe;
  React.useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.error("Failed to lock orientation", error);
      }
    };
    lockOrientation();

    return () => {
      const unlockOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT
          );
        } catch (error) {
          console.error("Failed to unlock orientation", error);
        }
      };
      unlockOrientation();
    };
  }, []);
  if (!iframeUrl || episodeQuery.isPending)
    return (
      <View className="flex-1 items-center justify-center h-screen w-screen">
        <Text>Loading....</Text>
      </View>
    );
  return (
    <WebView
      source={{ uri: iframeUrl }}
      userAgent="Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
    />
  );
}
