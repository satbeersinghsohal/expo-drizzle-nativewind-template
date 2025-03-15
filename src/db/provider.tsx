import React, {
  type PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { initialize, useMigrationHelper } from "./drizzle";

type ContextType = { db: Awaited<ReturnType<typeof initialize>> | null };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () =>
  useContext(DatabaseContext) as { db: Awaited<ReturnType<typeof initialize>> };

function MigrationProvider(props: any) {
  const { success, error } = useMigrationHelper();
  if (error) {
    console.log(error);
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return props.children;
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<Awaited<ReturnType<typeof initialize>> | null>(
    null
  );

  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      setDb(newDb);
    });
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      <MigrationProvider>{children}</MigrationProvider>
    </DatabaseContext.Provider>
  );
}
