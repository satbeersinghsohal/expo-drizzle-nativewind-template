import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { Search } from "lucide-react-native";
import * as React from "react";
import { Platform, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { ThemeToggle } from "~/components/ThemeToggle";
import { DatabaseProvider } from "~/db/provider";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

const queryClient = new QueryClient();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-secondary/30");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);
  React.useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
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
        } catch (error) {
          console.error("Failed to unlock orientation", error);
        }
      };
      unlockOrientation();
    };
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <DatabaseProvider>
          <StatusBar style={"light"} hidden={false} />
        <QueryClientProvider client={queryClient}>
          <RootSiblingParent>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "Anyflix",
                  headerRight: () => (
                    <View className="flex flex-row gap-2">
                      <Search
                        style={{ padding: 5 }}
                        color={"#fff"}
                        onPress={() => router.push("/show/search")}
                      />

                      <ThemeToggle />
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="show/[id]"
                options={{
                  title: "Show",
                  headerRight: () => (
                    <View className="flex flex-row gap-2">
                      <Search
                        color={"#fff"}
                        onPress={() => router.push("/show/search")}
                      />
                      <ThemeToggle />
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="episode"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="show/search"
                options={{
                  title: "Search Shows",
                }}
              />
            </Stack>
            <PortalHost />
          </RootSiblingParent>
        </QueryClientProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
